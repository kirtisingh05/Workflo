import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Contributor from "../models/contributor.js";
import Board from "../models/board.js";

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const mailer = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  secureConnection: false,
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

function generateInviteHash(boardId, boardName, email, senderName, role) {
  return jwt.sign(
    { boardId, boardName, email, senderName, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    },
  );
}

async function invite(req, res) {
  const { inviteEmail, senderName, boardName, role } = req.body;
  const { boardId } = req.params;

  try {
    const existingUser = await User.get({ email: inviteEmail });
    if (existingUser && existingUser.length > 0) {
      const existingContributor = await Contributor.getOne(
        boardId,
        existingUser[0]._id,
      );

      if (existingContributor) {
        return res.status(400).json({
          message: "Invited person is already a contribtuor to this board",
        });
      }
    }

    const inviteHash = generateInviteHash(
      boardId,
      boardName,
      inviteEmail,
      senderName,
      role,
    );
    const link = `http://localhost:5173/accept-invite?invite_hash=${inviteHash}`;

    const mailOptions = {
      from: `"Workflo Team" <${EMAIL_USERNAME}>`,
      to: inviteEmail,
      subject: `${senderName} invited you to their Workflo board: ${boardName}`,
      text: `You've been invited to collaborate on ${senderName}'s board - ${boardName} with the role ${role} on Workflo.`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f7; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #4a90e2; color: white; padding: 25px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Workflo Board Invitation</h1>
            </div>
            <div style="padding: 30px;">
              <p style="font-size: 16px; color: #333;">Hello,</p>
              <p style="font-size: 15px; color: #555;">You've been invited to collaborate on ${senderName}'s board - ${boardName} with the role ${role} on <strong>Workflo</strong>, your workspace for managing tasks and projects with ease.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #4a90e2; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Accept Invitation
                </a>
              </div>
              <p style="font-size: 14px; color: #999;">If the button above doesn’t work, copy and paste the following link in your browser:</p>
              <p style="word-break: break-all; font-size: 14px; color: #666;">${link}</p>
              <p style="font-size: 14px; color: #999; margin-top: 30px;">See you on the board!<br>— The Workflo Team</p>
            </div>
          </div>
        </div>
      `,
    };

    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "Error sending invite email.",
          success: false,
        });
      }

      return res
        .status(200)
        .json({ message: "Invite email sent successfully!" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function decodeInviteHash(req, res) {
  const { inviteHash } = req.body;
  try {
    if (!inviteHash || inviteHash === "") {
      return res.status(400).json({ message: "No invite hash found" });
    }

    const decoded = jwt.verify(inviteHash, process.env.JWT_SECRET);
    res.status(200).json({
      boardId: decoded.boardId,
      boardName: decoded.boardName,
      senderName: decoded.senderName,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function acceptInvite(req, res) {
  const { boardId, userId } = req.params;
  const { role } = req.body;
  console.log("Accepting invite for user:", userId, "to board:", boardId);
  try {
    const existingContributor = await Contributor.getOne(boardId, userId);
    if (existingContributor) {
      return res
        .status(400)
        .json({ message: "Already a contributor to this board" });
    }

    const contributor = await Contributor.create({
      user: userId,
      board: boardId,
      role: role,
    });

    await Board.update(boardId, { $push: { contributors: contributor._id } });

    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default { invite, decodeInviteHash, acceptInvite };
