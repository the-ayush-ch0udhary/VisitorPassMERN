const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phone, message) => {
  try {
    if (!phone || !message) {
      throw new Error('Phone number and message are required');
    }

    // Convert Indian numbers to E.164 format
    let formattedPhone = phone.trim();

    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`SMS sent successfully: ${result.sid}`);

    return {
      success: true,
      sid: result.sid
    };

  } catch (error) {
    console.error(`SMS sending failed: ${error.message}`);

    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = { sendSMS };