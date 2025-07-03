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
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
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
