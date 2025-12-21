import { Resend } from "resend";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { clinicName, correction, email } = req.body;

    // Validate required fields
    if (!clinicName || !correction) {
      return res
        .status(400)
        .json({ error: "Clinic name and correction are required" });
    }

    const submissionData = {
      clinicName,
      correction,
      email: email || "not provided",
      timestamp: new Date().toISOString(),
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    };

    console.log("Correction submitted:", submissionData);

    // Send email notification if Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: "corrections@updates.sexualhealth.nyc",
          to: "hello@sexualhealth.nyc",
          subject: `Clinic Correction: ${clinicName}`,
          html: `
            <h2>New Clinic Correction Submitted</h2>
            <p><strong>Clinic:</strong> ${clinicName}</p>
            <p><strong>Correction:</strong></p>
            <p>${correction.replace(/\n/g, "<br>")}</p>
            ${email !== "not provided" ? `<p><strong>Submitted by:</strong> ${email}</p>` : ""}
            <p><strong>Timestamp:</strong> ${submissionData.timestamp}</p>
            <p><strong>IP:</strong> ${submissionData.ip}</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails - still log it
      }
    } else {
      console.warn(
        "RESEND_API_KEY not configured - email notification skipped",
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Thank you! Your correction has been submitted and will be reviewed shortly.",
    });
  } catch (error) {
    console.error("Error processing correction:", error);
    return res.status(500).json({
      error:
        "Failed to submit correction. Please try again or email hello@sexualhealth.nyc directly.",
    });
  }
}
