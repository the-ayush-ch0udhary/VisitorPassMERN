const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');

// Generate and send a 6-digit OTP code to an email address
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    // Generate random 6-digit numeric OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry to 10 minutes in the future
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    // Store or update the OTP record in the collection
    await OTP.findOneAndUpdate(
      { email },
      { otp: generatedOtp, expiryTime },
      { upsert: true, new: true }
    );

    // Send the email with the OTP code
    await sendOTPEmail(email, generatedOtp);

    res.json({ message: 'OTP verification code has been sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate the provided OTP code
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required' });
    }

    // Find the record for the email
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Verification failed: No code requested for this email' });
    }

    // Verify expiry
    if (new Date() > new Date(otpRecord.expiryTime)) {
      await OTP.deleteOne({ email }); // Clear expired record
      return res.status(400).json({ message: 'Verification failed: OTP code has expired' });
    }

    // Compare codes
    if (otpRecord.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Verification failed: Incorrect OTP code' });
    }

    // Clean up validated OTP record
    await OTP.deleteOne({ email });

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
