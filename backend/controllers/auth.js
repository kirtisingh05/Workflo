import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}
async function signup(req, res) {
  const { username, email, password } = req.body;

  try {
    const existingUserDoc = await User.get({ $or: [{ username }, { email }] });
		const existingUser = existingUserDoc[0];
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ username, email, password: hashedPassword });

    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Error while signing up" });
  }
}

async function signin(req, res) {
  const { username, email, password } = req.body;

  try {
    const userDoc = await User.get({ $or: [{ username }, { email }] });
    const user = userDoc[0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Signin successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while signing in", error: error.message });
  }
}

async function googleAuth(req, res) {}

async function signout(req, res) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
}

export default {
  signin,
  signup,
  googleAuth,
  signout,
};
