const nodemailer = require('nodemailer');
const path = require('path');

exports.sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'OTP Verification',
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
    `
  });
};

exports.sendPassEmail = async (
  visitorEmail,
  visitorName,
  pdfFilename
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const pdfPath = path.join(
    __dirname,
    '..',
    'uploads',
    'passes',
    pdfFilename
  );

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: visitorEmail,
    subject: 'Visitor Pass Approved',
    html: `
      <h2>Visitor Pass Approved</h2>
      <p>Hello ${visitorName}</p>
      <p>Your visitor pass is attached to this email.</p>
    `,
    attachments: [
      {
        filename: pdfFilename,
        path: pdfPath
      }
    ]
  });
};

exports.sendApprovalNotice = async (
  email,
  visitorName,
  status
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Appointment Update',
    html: `
      <p>Hello ${visitorName}</p>
      <p>Your appointment status is ${status}</p>
    `
  });
};