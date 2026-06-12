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


// Create a new appointment request 
exports.createAppointment = async (req, res) => {
  try {
    const { visitorId, hostId, organizationId, date, purpose } = req.body;

    if (!visitorId || !hostId || !organizationId || !date || !purpose) {
      return res.status(400).json({
        message: 'Please fill all fields'
      });
    }

    const appointment = new Appointment({
      visitorId,
      hostId,
      organizationId,
      date,
      purpose,
      status: 'Pending'
    });

    await appointment.save();

    await AuditLog.create({
      userId: req.user._id,
      action: 'Created appointment'
    });

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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: 'Appointment not found'
      });
    }

    appointment.status = 'Approved';
    await appointment.save();

    const visitor = await Visitor.findById(appointment.visitorId);
    const host = await User.findById(appointment.hostId);
    const organization = await Organization.findById(appointment.organizationId);

    const expiryDate = new Date(appointment.date);
    expiryDate.setHours(expiryDate.getHours() + 24);

    const pass = new Pass({
      visitorId: visitor._id,
      appointmentId: appointment._id,
      expiryDate
    });

    await pass.save();

    const qrCode = await QRCode.toDataURL(
      JSON.stringify({ passId: pass._id })
    );

    pass.qrCode = qrCode;

    const pdfFile = await generatePassPDF(
      pass,
      visitor,
      host,
      organization
    );

    pass.pdfPath = pdfFile;

    await pass.save();

    await sendPassEmail(
      visitor.email,
      visitor.name,
      pdfFile
    );

    await sendSMS(
      visitor.phone,
      `Hello ${visitor.name}, your visit has been approved.`
    );

    await AuditLog.create({
      userId: req.user._id,
      action: 'Approved appointment'
    });

    res.json({
      appointment,
      pass
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
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

    await sendSMS(
      visitor.phone,
      `Hello ${visitor.name}, unfortunately your appointment request has been rejected.`
    );

    
    await AuditLog.create({
      userId: req.user._id,
      action: 'Rejected appointment'
    });

    res.json({ message: 'Appointment rejected successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


