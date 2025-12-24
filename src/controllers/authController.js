import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { sendOtpEmail } from "../utils/emailService.js";


// --------------------------
// TASK 3: FORGOT PASSWORD (SEND OTP)
// --------------------------
export async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const [user] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      "INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // ✅ SEND EMAIL
    await sendOtpEmail(email, otp);

    return res.json({
      msg: "OTP sent to email successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
}


// --------------------------
// TASK 4: VERIFY OTP + RESET PASSWORD
// --------------------------
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check OTP
    const [result] = await db.query(
      "SELECT * FROM password_resets WHERE email = ? AND otp = ? ORDER BY id DESC LIMIT 1",
      [email, otp]
    );

    if (result.length === 0) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const record = result[0];

    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update user password
    await db.query("UPDATE users SET password = ? WHERE email = ?", [hashed, email]);

    // Delete OTP after successful reset
    await db.query("DELETE FROM password_resets WHERE email = ?", [email]);

    return res.json({ msg: "Password reset successful" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
}

// --------------------------
// TASK 1: REGISTER
// --------------------------
export async function register(req, res) {
  try {
    const {
      name,
      phone,
      email,
      password,
      is_investor,
      company_name,
      linkedin_url,
      website_url,
      bio,
      past_investments,
      investment_type,
      min_investment,
      max_investment,
      preferred_categories,
      profile_image
    } = req.body;

    if (!password) {
  return res.status(400).json({ error: "Password is required" });
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get uploaded image path (if any)
    let profileImagePath = null;
    if (req.file) {
      profileImagePath = `/uploads/profile/${req.file.filename}`;
    }


    // Insert new user
    const [result] = await db.query(
      `INSERT INTO users 
        (name, phone, email, password, is_investor, company_name, linkedin_url, website_url, bio, past_investments, investment_type, min_investment, max_investment, preferred_categories, profile_image
)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        email,
        hashedPassword,
        is_investor || 0,
        company_name || null,
        linkedin_url || null,
        website_url || null,
        bio || null,
        past_investments || null,
        investment_type || null,
        min_investment || null,
        max_investment || null,
        preferred_categories || null,
        profileImagePath || null
      ]
    );

    const uid = result.insertId;

    // If image was uploaded
    if (req.file) {
      const oldPath = req.file.path;
      const ext = path.extname(req.file.originalname);
      const newFileName = `user_${uid}${ext}`;
      const newPath = `src/storage/profile/${newFileName}`;

      fs.renameSync(oldPath, newPath);

      await db.query(
        "UPDATE users SET profile_image = ? WHERE uid = ?",
        [`/uploads/profile/${newFileName}`, uid]
      );
}

    return res.json({ message: "User registered successfully", uid: result.insertId });

  } catch (err) {
    console.error("REGISTER ERROR >>>", err);
    return res.status(500).json({ error: "Registration failed" });
  }
}



// --------------------------
// TASK 2: LOGIN
// --------------------------
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(400).json({ error: "Invalid credentials." });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign(
      { uid: user.uid, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        is_investor: user.is_investor,
        profile_image: user.profile_image 
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
}


/* =========================================================================
   TASK 10 — UPLOAD & SAVE PROFILE IMAGE
========================================================================= */

export async function uploadProfileImage(req, res) {
  try {

    console.log("HEADERS >>>", req.headers);
  console.log("FILE >>>", req.file);
  console.log("BODY >>>", req.body);
    const uid = req.user.uid;

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    // temp file info
    const tempPath = req.file.path;
    const ext = path.extname(req.file.originalname);

    // final file name
    const finalFileName = `user_${uid}${ext}`;
    const finalPath = path.join("src/storage/profile", finalFileName);

    // 🔁 Rename file
    fs.renameSync(tempPath, finalPath);

    // DB path
    const dbImagePath = `profile/${finalFileName}`;

    // Update DB
    await db.query(
      "UPDATE users SET profile_image = ? WHERE uid = ?",
      [dbImagePath, uid]
    );

    return res.json({
      message: "Profile image uploaded & renamed successfully",
      image_url: `/uploads/${dbImagePath}`
    });

  } catch (err) {
    console.error("PROFILE IMAGE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to upload profile image." });
  }
}



// Get the Profile Data
export async function getProfile(req, res) {
  try {
    console.log("🔥 REQ.USER =", req.user);  // DEBUG

    const uid = req.user?.uid;

    if (!uid) {
      return res.status(400).json({ error: "User authentication failed. No UID." });
    }

    console.log("🔥 FETCHING PROFILE FOR UID =", uid); // DEBUG

    const [rows] = await db.query(
      `SELECT uid, name, email, phone, profile_image, created_at, updated_at
       FROM users
       WHERE uid = ?`,
      [uid]
    );

    console.log("🔥 SQL RESULT =", rows); // DEBUG

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      message: "Profile fetched successfully.",
      profile: rows[0],
    });

  } catch (err) {
    console.error("🔥 GET PROFILE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to fetch profile data." });
  }
}

// Update Profile:
export async function updateProfile(req, res) {
  try {
    const uid = req.user.uid;
    let { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: "Name, phone, and email are required." });
    }

    // Email validation
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({ error: "Email must be a valid Gmail address." });
    }

    // Phone validation
    if (phone.length !== 10) {
      return res.status(400).json({ error: "Phone number must be 10 digits." });
    }

    // Profile image (optional)
    let profileImagePath = null;
    if (req.file) {
      profileImagePath = `src/storage/profile/${req.file.filename}`;
    }

    // Build dynamic SQL
    let sql = `
      UPDATE users
      SET name = ?, phone = ?, email = ?
    `;
    const params = [name, phone, email];

    if (profileImagePath) {
      sql += ", profile_image = ?";
      params.push(profileImagePath);
    }

    sql += ", updated_at = NOW() WHERE uid = ?";
    params.push(uid);

    await db.query(sql, params);

    return res.json({
      message: "Profile updated successfully.",
      profile: {
        name,
        phone,
        email,
        profile_image: profileImagePath || "unchanged",
      }
    });

  } catch (err) {
    console.error("UPDATE PROFILE ERROR >>>", err);
    return res.status(500).json({ error: "Failed to update profile." });
  }
}

// Delete Account
export async function deleteAccount(req, res) {
  try {
    const uid = req.user.uid;

    // STEP 1 — Delete profile image if exists
    const [userRows] = await db.query(
      "SELECT profile_image FROM users WHERE uid = ?",
      [uid]
    );

    if (userRows.length > 0 && userRows[0].profile_image) {
      const filePath = userRows[0].profile_image;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    // STEP 2 — Delete all projects of this user
    await db.query("DELETE FROM projects WHERE uid = ?", [uid]);

    // STEP 3 — Delete the user
    await db.query("DELETE FROM users WHERE uid = ?", [uid]);

    return res.json({
      message: "Account and all associated projects deleted successfully.",
    });

  } catch (err) {
    console.error("DELETE ACCOUNT ERROR >>>", err);
    return res.status(500).json({
      error: "Failed to delete account.",
    });
  }
}
