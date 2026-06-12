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

// Creating an Appointment
exports.createAppointment = async (req, res) => {
  try {
    const { visitorId, hostId, organizationId, date, purpose } = req.body;

    // All fields should be filled
    if (!visitorId || !hostId || !organizationId || !date || !purpose) {
      return res.status(400).json({ message: 'Please fill all fields' });
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
    res.status(201).json(appointment);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Getting an Appointment
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    // Checking user roles to filter appointments
    if (req.user.organizationId) {
      query.organizationId = req.user.organizationId;
    }

    if (req.user.role === 'Host') {
      query.hostId = req.user._id;
    }

    if (req.user.role === 'Visitor') {
      const visitor = await Visitor.findOne({
        email: req.user.email,
        organizationId: req.user.organizationId
      });

      if (visitor) {
        query.visitorId = visitor._id;
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

// Approving an Appointment
exports.approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'Approved';
    await appointment.save();

    
    const visitor = await Visitor.findById(appointment.visitorId);
    const host = await User.findById(appointment.hostId);
    const organization = await Organization.findById(appointment.organizationId);


    // Expiry date will be 24 hours later
    const expiryDate = new Date(appointment.date);
    expiryDate.setHours(expiryDate.getHours() + 24);

    // Creating a temporary pass
    const pass = new Pass({
      visitorId: visitor._id,
      appointmentId: appointment._id,
      qrCode: 'TEMP',
      pdfPath: 'TEMP',
      expiryDate
    });
    await pass.save();

    // Generating real QR code 
    const qrCode = await QRCode.toDataURL(JSON.stringify({ passId: pass._id }));
    pass.qrCode = qrCode;

    // Generating PDF and updating pass
    const pdfFile = await generatePassPDF(pass, visitor, host, organization);
    pass.pdfPath = pdfFile;
    await pass.save();

    // Sending notifications to the visitor
    await sendPassEmail(visitor.email, visitor.name, pdfFile);
    await sendSMS(visitor.phone, `Hello ${visitor.name}, your visit has been approved.`);

    
    await AuditLog.create({
      userId: req.user._id,
      action: 'Approved appointment'
    });

    res.json({ appointment, pass });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rejecting Appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    
    if (req.user.role === 'Host' && appointment.hostId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    if (appointment.status === 'Rejected') {
      return res.status(400).json({ message: 'Appointment already rejected' });
    }

    appointment.status = 'Rejected';
    await appointment.save();

    const visitor = await Visitor.findById(appointment.visitorId);
    

    // Sending rejection notifications
    await sendApprovalNotice(visitor.email, visitor.name, 'Rejected');
    await sendSMS(visitor.phone, `Hello ${visitor.name}, unfortunately your appointment request has been rejected.`);

    await AuditLog.create({
      userId: req.user._id,
      action: 'Rejected appointment'
    });

    res.json({
      message: 'Appointment rejected successfully',
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};