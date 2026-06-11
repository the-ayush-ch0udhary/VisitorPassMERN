const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Create standard SMTP transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.EMAIL_PORT || 587),
    auth: {
      user: process.env.EMAIL_USER || 'your_smtp_user',
      pass: process.env.EMAIL_PASS || 'your_smtp_password'
    }
  });
};

// Send OTP code to email
exports.sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@visitorpass.com',
      to: email,
      subject: 'Visitor Pass System - Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b;">Verification Code</h2>
          <p>Hello,</p>
          <p>Please use the following One-Time Password (OTP) to verify your visitor request. This code is valid for 10 minutes.</p>
          <div style="font-size: 24px; font-weight: bold; background: #f1f5f9; padding: 10px; text-align: center; border-radius: 4px; letter-spacing: 4px; color: #0f172a; margin: 20px 0;">
            ${otp}
          </div>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] OTP successfully sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service Error] Failed to send OTP to ${email}: ${error.message}`);
    throw error;
  }
};

// Send Pass badge PDF to visitor's email
exports.sendPassEmail = async (visitorEmail, visitorName, pdfFilename) => {
  try {
    const transporter = createTransporter();
    const pdfPath = path.join(__dirname, '..', 'uploads', 'passes', pdfFilename);

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@visitorpass.com',
      to: visitorEmail,
      subject: 'Your Digital Visitor Pass is Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a;">Visitor Pass Approved</h2>
          <p>Hello <strong>${visitorName}</strong>,</p>
          <p>Your appointment has been approved. Attached to this email is your printable digital pass badge.</p>
          <p>Please present the QR code at the reception desk upon your arrival.</p>
        </div>
      `,
      attachments: fs.existsSync(pdfPath) ? [{
        filename: pdfFilename,
        path: pdfPath
      }] : []
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Pass PDF successfully sent to ${visitorEmail}`);
  } catch (error) {
    console.error(`[Email Service Error] Failed to send Pass email to ${visitorEmail}: ${error.message}`);
  }
};

// Send general appointment status updates
exports.sendApprovalNotice = async (email, visitorName, status) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@visitorpass.com',
      to: email,
      subject: `Visitor Appointment ${status}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2>Appointment Update</h2>
          <p>Hello <strong>${visitorName}</strong>,</p>
          <p>Your appointment request has been marked as <strong>${status}</strong>.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Status notice sent to ${email}`);
  } catch (error) {
    console.error(`[Email Service Error] Failed to send notice to ${email}: ${error.message}`);
  }
};
