import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(to: string, otp: string, name: string) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Email Vowify.id</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { margin:0; padding:0; background:#f5f5f0; font-family:'Inter',sans-serif; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#1C1612;border-radius:24px;overflow:hidden;max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 30px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:32px;font-weight:800;color:#D4AF6C;letter-spacing:-0.5px;margin-bottom:4px;">Vowify.id</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:2px;text-transform:uppercase;">Platform Undangan Digital</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:rgba(255,255,255,0.7);font-size:15px;margin:0 0 8px;">Halo, <strong style="color:#fff;">${name}</strong>!</p>
              <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 32px;line-height:1.6;">
                Terima kasih telah mendaftar di <strong style="color:#D4AF6C;">Vowify.id</strong>. 
                Masukkan kode OTP berikut untuk memverifikasi email Anda.
              </p>

              <!-- OTP Box -->
              <div style="background:rgba(212,175,108,0.08);border:1.5px solid rgba(212,175,108,0.3);border-radius:16px;padding:32px;text-align:center;margin-bottom:32px;">
                <div style="font-size:11px;color:rgba(212,175,108,0.7);letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">Kode Verifikasi</div>
                <div style="font-size:48px;font-weight:800;color:#D4AF6C;letter-spacing:12px;font-family:monospace;">${otp}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:16px;">⏱ Berlaku selama <strong style="color:rgba(255,255,255,0.5);">10 menit</strong></div>
              </div>

              <p style="color:rgba(255,255,255,0.35);font-size:12px;margin:0;line-height:1.7;border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
                Jika Anda tidak merasa mendaftar, abaikan email ini. 
                Kode ini bersifat rahasia, jangan bagikan kepada siapapun.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:11px;color:rgba(255,255,255,0.2);">© 2024 Vowify.id · Platform Undangan Pernikahan Digital</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await transporter.sendMail({
        from: `"Vowify.id 💍" <${process.env.GMAIL_USER}>`,
        to,
        subject: `[Vowify.id] Kode Verifikasi Email: ${otp}`,
        html,
    });
}
