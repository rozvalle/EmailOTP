const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { generateOTP, setOTP, verifyOTP } = require('../otpStore');
const { getUserByEmail, updateUserPassword } = require('../utils/userApi');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const otp = generateOTP();
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your ITBytes reset password code',
      html: ` <!DOCTYPE html>
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        </style>
      </head>
      <body style="font-family: 'Poppins', sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dsayqafkn/image/upload/v1751510579/logo_colored_pwo3ps.png" alt="YourApp Logo" style="height: 60px;" />
          </div>

          <!-- Content -->
          <h2 style="text-align: center; color: #007BFF;">OTP Verification</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Use the OTP code below:</p>
          
          <div style="text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; color: #222;">
            ${otp}
          </div>

          <p>This OTP will expire in 5 minutes. Please don’t share it with anyone.</p>
          <p>If you didn’t request a reset, you can ignore this email.</p>

          <br/>
          <p style="font-size: 14px; color: #888;">— ITBytes Team</p>
        </div>
      </body>
    </html>`,
    });

    setOTP(email, otp);
    res.json({ success: true, message: 'OTP sent' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (verifyOTP(email, otp)) {
    res.json({ success: true, message: 'OTP verified' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  try {
    await updateUserPassword(user._id, password); // You can hash it before sending
    res.json({ success: true, message: 'Password updated' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

module.exports = router;
