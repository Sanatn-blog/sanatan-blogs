import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testEmail() {
  console.log("Testing email configuration...\n");
  console.log("SMTP Host:", process.env.SMTP_HOST);
  console.log("SMTP Port:", process.env.SMTP_PORT);
  console.log("SMTP User:", process.env.SMTP_USER);
  console.log("From Email:", process.env.FROM_EMAIL);
  console.log("\n---\n");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Verify connection
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("[SUCCESS] SMTP connection verified successfully!\n");

    // Send test email
    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.SMTP_USER, // sending to self for testing
      subject: "Test Email - Sanatan Blogs",
      text: "This is a test email to verify Zoho Mail configuration.",
      html: "<p>This is a test email to verify <strong>Zoho Mail</strong> configuration.</p>",
    });

    console.log("[SUCCESS] Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("\n[SUCCESS] Email configuration is working correctly!");
  } catch (error) {
    console.error("[ERROR] Email configuration test failed:");
    console.error("Error:", error.message);
    if (error.code) console.error("Error Code:", error.code);
    if (error.command) console.error("Failed Command:", error.command);
  }
}

testEmail();
