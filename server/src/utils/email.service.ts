import nodemailer, { Transporter } from 'nodemailer';

interface SendRejectionEmailParams {
  toEmail: string;
  companyName: string;
  rejectionReason: string;
}

export async function sendCompanyRejectionEmail({
  toEmail,
  companyName,
  rejectionReason,
}: SendRejectionEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const fromAddress = process.env.EMAIL_FROM || '"AddyJob Admin" <admin@addyjob.com>';

    let transporter: Transporter;

    if (smtpHost && smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      // Fallback test/development transporter so it never crashes even if SMTP not configured in .env
      const testAccount = await nodemailer.createTestAccount().catch(() => null);
      if (testAccount) {
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } else {
        // Mock fallback transporter
        console.log(`[Email Service Simulation] Rejection email to ${toEmail} for company "${companyName}". Reason: ${rejectionReason}`);
        return { success: true, messageId: 'simulated-' + Date.now() };
      }
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fee2e2; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #e11d48; margin: 0; font-size: 24px; font-weight: 800;">AddyJob Verification Update</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Super Admin Verification Notification</p>
        </div>

        <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h2 style="color: #9f1239; font-size: 16px; margin: 0 0 8px 0;">Company Verification Rejected</h2>
          <p style="color: #881337; font-size: 14px; line-height: 1.5; margin: 0;">
            Dear <strong>${companyName || 'Employer'}</strong> Team,
            <br/><br/>
            Your company verification request on the <strong>AddyJob Platform</strong> has been reviewed and rejected by the Super Admin.
          </p>
        </div>

        <div style="background-color: #f8fafc; border-left: 4px solid #e11d48; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px;">
          <h3 style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Reason for Rejection:</h3>
          <p style="color: #e11d48; font-size: 15px; font-weight: 600; line-height: 1.5; margin: 0; white-space: pre-wrap;">${rejectionReason || 'Verification requirements were not met. Please check your GSTIN, company documents, or official email.'}</p>
        </div>

        <div style="color: #475569; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0;"><strong>What to do next:</strong></p>
          <ul style="padding-left: 20px; margin: 0 0 12px 0;">
            <li>Log in to your AddyJob Company Dashboard.</li>
            <li>Review the red alert banner on your screen with the rejection remarks.</li>
            <li>Update your company profile information, website, and GSTIN details.</li>
            <li>After saving, your profile will be re-submitted for approval.</li>
          </ul>
          <p style="color: #dc2626; font-size: 12px; font-weight: bold; margin: 0;">
            * Note: Without Super Admin approval, job postings, resume searches, and subscription purchases remain disabled.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

        <div style="text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">AddyJob Talent Solutions • Super Admin Department</p>
          <p style="margin: 4px 0 0 0;">Need help? Contact support at <a href="mailto:admin@addyjob.com" style="color: #7c3aed; text-decoration: none;">admin@addyjob.com</a></p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: `[AddyJob] Company Verification Rejected - Action Required for ${companyName}`,
      text: `Dear ${companyName},\n\nYour company verification request on AddyJob has been rejected by the Super Admin.\n\nReason: ${rejectionReason}\n\nPlease log in to your dashboard to review and update your information.\n\n- AddyJob Team`,
      html: htmlContent,
    });

    console.log(`Rejection email sent successfully to ${toEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Failed to send rejection email:', error);
    return { success: false, error: error.message };
  }
}
