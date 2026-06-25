const bcrypt = require("bcryptjs");
const db = require("../../config/db");
const emailService = require("../../utils/email");

const test = [];
const signup = async (req, res) => {
  try {


    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    

    const [existingUsers] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    const subject = "Welcome to Quiz App";
    const text = `Hi ${name},\n\nThank you for signing up. Your account is now created.`;
    try {
      await emailService.sendEmail(email, subject, text);
    } catch (emailError) {
      console.error("Signup email failed:", emailError);
      return res.status(500).json({
        message: "Signup succeeded but welcome email failed to send.",
      });
    }

    res.status(201).json({
      message: "Signup Successful",
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Signup failed",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("LOGIN REQUEST RECEIVED");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    const user = users[0];
    let passwordMatches = await bcrypt.compare(password, user.password);
    console.log("Password matches 84:", passwordMatches);

    if (!passwordMatches && user.password === password) {
      // Legacy plaintext password support: hash and upgrade stored password.
      const hashed = await bcrypt.hash(password, 10);
      await db.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashed,
        user.id,
      ]);
      passwordMatches = true;
      console.log("Upgraded legacy password storage for user:", user.email);
    }

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    if (!user.is_verified) {
      const subject = "your otp";
      const otp = Math.floor(10000 + Math.random() * 90000);
      const text = `Your OTP is: ${otp}`;
      await db.execute(
        "INSERT INTO users_verification (user_id, otp) VALUES (?, ?)",
        [user.id, otp],
      );
      try {
        await emailService.sendEmail(email, subject, text);
      } catch (emailError) {
        console.error("Login OTP email failed:", emailError);
        return res.status(502).json({
          message:
            "OTP email failed to send. Check your email credentials in backend .env.",
        });
      }
    }

    res.json({
      message: "Login Successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("verify otp", email, otp);

  const [users] = await db.execute(
    "SELECT id, is_verified FROM users WHERE email = ?",
    [email],
  );

  if (users.length === 0) {
    return res.json({ success: false, message: "No user found" });
  }

  if (!!users[0].is_verified) {
    return res.json({
      success: false,
      message: "user already verfied",
    });
  }

  const [verifications] = await db.execute(
    "SELECT otp FROM users_verification WHERE user_id = ? order by id desc limit 1",
    [users[0].id],
  );

  console.log(verifications);

  if (verifications.length === 0 || verifications[0].otp != otp) {
    return res.json({ success: false, message: "wrong OTP" });
  }

  await db.execute("UPDATE users SET is_verified = true WHERE id = ?", [
    users[0].id,
  ]);

  res.json({ success: true, message: "Verify OTP" });
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    return res.status(404).json({
      message: "No user found",
    });
  }

  const user = users[0];
  if (!!user.is_verified) {
    return res.json({
      success: false,
      message: "user already verfied",
    });
  }
  const subject = "your otp";
  const otp = Math.floor(10000 + Math.random() * 90000);
  const text = `Your OTP is: ${otp}`;
  await db.execute(
    "INSERT INTO users_verification (user_id, otp) VALUES (?, ?)",
    [user.id, otp],
  );
  await emailService.sendEmail(email, subject, text);
  return res.json({ success: true, message: "otp send" }); 
};

module.exports = {
  signup,
  login,
  sendOtp,
  verifyOtp,
};
