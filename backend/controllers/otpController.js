const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/emailService');

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const generatedOtp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const expiryTime = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await OTP.findOneAndUpdate(
            { email },
            {
                otp: generatedOtp,
                expiryTime
            },
            {
                upsert: true,
                new: true
            }
        );

        await sendOTPEmail(email, generatedOtp);

        res.json({
            success: true,
            message: 'OTP sent successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: 'Email and OTP are required'
            });
        }

        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: 'OTP not found'
            });
        }

        if (
            otpRecord.expiryTime < new Date()
        ) {
            await OTP.deleteOne({ email });

            return res.status(400).json({
                message: 'OTP expired'
            });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({
                message: 'Invalid OTP'
            });
        }

        await OTP.deleteOne({ email });

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};