const Appointment = require('../models/Appointment');
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const Pass = require('../models/Pass');
const Organization = require('../models/Organization');
const AuditLog = require('../models/AuditLog');
const QRCode = require('qrcode');
const { generatePassPDF } = require('../utils/pdfGenerator');
const { sendSMS } = require('../utils/smsService');
const { sendPassEmail, sendApprovalNotice } = require('../utils/emailService');


const logActivity = async (userId, action) => {
  try {
    const log = new AuditLog({ userId, action });
    await log.save();
  } catch (error) {
    console.error(`Audit logging failed: ${error.message}`);
  }
};


// Create a new appointment request 
exports.createAppointment = async (req, res) => {
  try {


    const { visitorId, hostId, date, purpose, organizationId } = req.body;

    if (!visitorId || !hostId || !organizationId || !date || !purpose) {
      return res.status(400).json({
        message: "All appointment fields are required",
        received: req.body
      });
    }

    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({
        message: 'Organization not found'
      });
    }

    const host = await User.findById(hostId);

    if (!host) {
      return res.status(404).json({
        message: 'Host not found'
      });
    }

    const appointment = new Appointment({
      visitorId,
      hostId,
      organizationId,
      date,
      purpose,
      status: "Pending"
    });

    await appointment.save();


    const loggedInUser = req.user ? req.user._id : null;

    await logActivity(
      loggedInUser,
      `Created appointment request for visitor profile ${visitorId}`
    );

    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    // Role-specific filtering
    if (req.user.role === 'Host') {
      // Hosts can only see appointments assigned to them
      query.hostId = req.user._id;
    } else if (req.user.role === 'Visitor') {

      // Visitors can only see their own appointments
      const visitorProfile = await Visitor.findOne({
        email: req.user.email,
        organizationId: req.user.organizationId
      });
      if (visitorProfile) {
        query.visitorId = visitorProfile._id;

      } else {

        return res.json([]);
      }
    }

    const appointments = await Appointment.find(query)
      .populate('visitorId')
      .populate('hostId', 'name email')
      .populate('organizationId', 'name')
      .sort({ createdAt: -1 });


    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Host action: Approve Appointment & Generate Digital Pass
exports.approveAppointment = async (req, res) => {
  try {
    const query = { _id: req.params.id };

    if (req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    const appointment = await Appointment.findOne(query);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow Hosts to approve their own appointments, or Admins/Security guards of that org
    if (req.user.role === 'Host' && String(appointment.hostId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You are not the host for this appointment' });
    }

    if (appointment.status === 'Approved') {
      return res.status(400).json({
        message: 'Appointment already approved'
      });
    }
    appointment.status = 'Approved';
    await appointment.save();


    const visitor = await Visitor.findById(appointment.visitorId);
    const host = await User.findById(appointment.hostId);
    const organization = await Organization.findById(appointment.organizationId);

    // Pass valid for 24 hours
    const expiryDate = new Date(appointment.date);
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Create pass first
    const pass = new Pass({
      visitorId: visitor._id,
      appointmentId: appointment._id,
      qrCode: 'TEMP',
      pdfPath: 'TEMP',
      expiryDate
    });

    await pass.save();

    // Generate QR using passId
    const qrPayload = JSON.stringify({
      passId: pass._id
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    // Generate PDF
    const tempPass = {
      visitorId: visitor._id,
      appointmentId: appointment._id,
      qrCode: qrCodeDataUrl,
      expiryDate
    };



    const pdfFilename = await generatePassPDF(
      tempPass,
      visitor,
      host,
      organization
    );



    // Update pass with actual values
    pass.qrCode = qrCodeDataUrl;
    pass.pdfPath = pdfFilename;

    await pass.save();


    //Send notifications 
    await sendPassEmail(visitor.email, visitor.name, pdfFilename);
    try {
      await sendSMS(
        visitor.phone,
        `Hello ${visitor.name}, your visit to ${organization.name} is approved. Your digital pass has been emailed to you.`
      );
    } catch (err) {
      console.error("SMS failed:", err.message);
    }

    await logActivity(req.user._id, `Approved appointment ${appointment._id} and generated digital pass ${pass._id}`);

    res.json({ message: 'Appointment approved and pass generated successfully', appointment, pass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const query = { _id: req.params.id };

    if (req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    const appointment = await Appointment.findOne(query);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only allow Hosts to reject their own appointments, or Admins/Security
    if (req.user.role === 'Host' && String(appointment.hostId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You are not the host for this appointment' });
    }


    if (appointment.status === 'Rejected') {
      return res.status(400).json({
        message: 'Appointment already rejected'
      });
    }
    appointment.status = 'Rejected';
    await appointment.save();

    // Notify Visitor
    const visitor = await Visitor.findById(appointment.visitorId);
    await sendApprovalNotice(visitor.email, visitor.name, 'Rejected');

    try {
      await sendSMS(
        visitor.phone,
        `Hello ${visitor.name}, unfortunately your appointment request has been rejected.`
      );
    } catch (err) {
      console.error("SMS failed:", err.message);
    }

    // Write Audit Log
    await logActivity(req.user._id, `Rejected appointment ${appointment._id}`);

    res.json({ message: 'Appointment rejected successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


