const express = require('express');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');

const app = express();
const port = 3000;

// Dummy user database (replace with your actual user database)
const users = {
  'user1@example.com': {
    id: '1',
    otp: '',
    otpExpiry: 0
  }
};

app.use(bodyParser.json());

// Generate and send OTP to the user
app.post('/login', (req, res) => {
  const { email } = req.body;
  const user = users[email];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  // Associate OTP with user
  users[email].otp = otp;
  users[email].otpExpiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  // Send OTP to the user (e.g., via email or SMS)
  console.log(`OTP for ${email}: ${otp}`);

  res.status(200).json({ message: 'OTP sent successfully' });
});

// Verify OTP and authenticate user
app.post('/verify', (req, res) => {
  const { email, otp } = req.body;
  const user = users[email];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if OTP is valid and not expired
  if (user.otp === otp && Date.now() < user.otpExpiry) {
    // Reset OTP and OTP expiry
    users[email].otp = '';
    users[email].otpExpiry = 0;

    // Authenticate user (you may implement your own authentication logic here)
    return res.status(200).json({ message: 'OTP verification successful. User authenticated.' });
  }

  res.status(401).json({ error: 'Invalid OTP or OTP has expired' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
