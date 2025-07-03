const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

function setOTP(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });
}

function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  const valid = record.otp === otp && Date.now() < record.expiresAt;
  if (valid) otpStore.delete(email); // remove OTP once used
  return valid;
}

module.exports = { generateOTP, setOTP, verifyOTP };
