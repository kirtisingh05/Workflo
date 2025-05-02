import nodemailer from "nodemailer";

const EMAIL_USERNAME = getStringEnv("EMAIL_USERNAME");
const EMAIL_PASSWORD = getStringEnv("EMAIL_PASSWORD");

const mailer = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
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

async function Invite(req, res) {
  try {
    const { InviteEmail, content } = req.body;

    const mailOptions = {
      from: EMAIL_USERNAME,
      to: InviteEmail,
      subject: `Invite mail`,
      html: `
        <h3>Message from the company:</h3>
        <p>${content}</p>
      `,
    };

    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error sending invite notification email.",
          success: false,
        });
      }

      console.log("Message sent: %s", info.messageId);
      return res.status(200).json({
        message: "Invite email sent successfully!",
        success: true,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

export { Invite };
