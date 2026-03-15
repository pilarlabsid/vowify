import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  // Set timeouts to avoid long hangs
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const BRAND_COLOR = '#A88132';
const BG_COLOR = '#F9FAFB';
const TEXT_COLOR = '#374151';
const TEXT_MUTED = '#6B7280';

const HEADER_HTML = `
  <tr>
    <td style="padding: 40px 0 32px; text-align: center;">
      <div style="font-size: 32px; font-weight: 700; color: ${BRAND_COLOR}; font-family: 'Times New Roman', Times, serif; letter-spacing: -0.5px;">Vowify.id</div>
      <div style="font-size: 10px; color: ${TEXT_MUTED}; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; font-weight: 600;">Premium Digital Invitation</div>
    </td>
  </tr>
`;

const FOOTER_HTML = (year: number) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="padding: 20px 0; text-align: center;">
        <div style="font-size: 11px; color: ${TEXT_MUTED}; opacity: 0.4; letter-spacing: 0.5px;">
          © ${year} Vowify.id — Platform Undangan Digital Premium
        </div>
      </td>
    </tr>
  </table>
`;

const BASE_STYLE = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; }
    .container { width: 100%; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
    @media only screen and (max-width: 600px) {
      .container { border-radius: 0 !important; border: none !important; }
      .content { padding: 32px 24px !important; }
    }
  </style>
`;

export async function sendOtpEmail(to: string, otp: string, name: string) {
  const year = new Date().getFullYear();
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${BASE_STYLE}
</head>
<body style="background-color: ${BG_COLOR}; padding: 40px 10px 10px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0" border="0">
          ${HEADER_HTML}
          <tr>
            <td class="content" style="padding: 0 48px 48px; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
              <p>Halo <strong>${name}</strong>,</p>
              <p>Terima kasih telah mendaftar di Vowify.id. Untuk melanjutkan proses pendaftaran akun Anda, silakan gunakan kode verifikasi di bawah ini:</p>
              
              <div style="background-color: #F3F4F6; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                <div style="font-size: 11px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700;">Kode Verifikasi</div>
                <div style="font-size: 40px; font-weight: 700; color: #111827; letter-spacing: 8px; font-family: Monaco, Consolas, monospace;">${otp}</div>
                <p style="font-size: 12px; color: ${TEXT_MUTED}; margin-top: 12px; margin-bottom: 0;">
                  Berlaku selama <strong>10 menit</strong>.
                </p>
              </div>

              <div style="margin-top: 48px; border-top: 1px solid #F3F4F6; padding-top: 24px; color: ${TEXT_MUTED}; font-size: 13px; line-height: 1.6;">
                Jika Anda tidak merasa melakukan pendaftaran ini, silakan abaikan email ini. Keamanan akun Anda adalah prioritas kami.
              </div>
            </td>
          </tr>
        </table>
        ${FOOTER_HTML(year)}
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Vowify.id" <${process.env.GMAIL_USER}>`,
    to,
    subject: `[Vowify.id] Kode Verifikasi: ${otp}`,
    html,
  });
}

export async function sendResetPasswordEmail(to: string, otp: string, name: string) {
  const year = new Date().getFullYear();
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${BASE_STYLE}
</head>
<body style="background-color: ${BG_COLOR}; padding: 40px 10px 10px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0" border="0">
          ${HEADER_HTML}
          <tr>
            <td class="content" style="padding: 0 48px 48px; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
              <p>Halo <strong>${name}</strong>,</p>
              <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Silakan gunakan kode OTP di bawah ini untuk melanjutkan:</p>
              
              <div style="background-color: #F3F4F6; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                <div style="font-size: 11px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700;">Kode Reset Password</div>
                <div style="font-size: 40px; font-weight: 700; color: #111827; letter-spacing: 8px; font-family: Monaco, Consolas, monospace;">${otp}</div>
                <p style="font-size: 12px; color: ${TEXT_MUTED}; margin-top: 12px; margin-bottom: 0;">
                  Berlaku selama <strong>5 menit</strong>.
                </p>
              </div>

              <div style="margin-top: 48px; border-top: 1px solid #F3F4F6; padding-top: 24px; color: ${TEXT_MUTED}; font-size: 13px; line-height: 1.6;">
                Abaikan email ini jika Anda tidak meminta penggantian kata sandi. Keamanan akun Anda senantiasa terjaga.
              </div>
            </td>
          </tr>
        </table>
        ${FOOTER_HTML(year)}
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Vowify.id" <${process.env.GMAIL_USER}>`,
    to,
    subject: `[Vowify.id] Kode Reset Password: ${otp}`,
    html,
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  const year = new Date().getFullYear();
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${BASE_STYLE}
</head>
<body style="background-color: ${BG_COLOR}; padding: 40px 10px 10px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0" border="0">
          ${HEADER_HTML}
          <tr>
            <td class="content" style="padding: 0 48px 48px; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #111827; font-size: 28px; font-weight: 800; margin: 0 0 12px; letter-spacing: -1px; font-family: 'Times New Roman', Times, serif;">Selamat Datang, ${name.split(' ')[0]}!</h1>
                <p style="color: ${TEXT_MUTED}; font-size: 16px; max-width: 400px; margin: 0 auto;">
                  Senang sekali Anda menjadi bagian dari Vowify.id. Mari buat setiap detail momen spesial Anda menjadi keabadian digital yang indah.
                </p>
              </div>

              <div style="background-color: #F8F9FB; border-radius: 16px; padding: 32px; margin-bottom: 40px; border: 1px solid #F1F5F9;">
                <p style="font-size: 11px; font-weight: 700; color: ${BRAND_COLOR}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px; text-align: center;">Mulai Langkah Pertama Anda</p>
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <div style="display: flex; align-items: flex-start;">
                        <span style="background-color: #ffffff; color: ${BRAND_COLOR}; font-weight: 800; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; line-height: 20px; text-align: center; margin-right: 12px; border: 1px solid #E5E7EB; flex-shrink: 0;">1</span>
                        <div>
                          <strong style="color: #111827; font-size: 14px;">Pilih Desain Eksklusif</strong>
                          <p style="margin: 4px 0 0; font-size: 13px; color: ${TEXT_MUTED};">Temukan tema yang paling mewakili karakter dan cinta Anda.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <div style="display: flex; align-items: flex-start;">
                        <span style="background-color: #ffffff; color: ${BRAND_COLOR}; font-weight: 800; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; line-height: 20px; text-align: center; margin-right: 12px; border: 1px solid #E5E7EB; flex-shrink: 0;">2</span>
                        <div>
                          <strong style="color: #111827; font-size: 14px;">Personalisasi Tanpa Batas</strong>
                          <p style="margin: 4px 0 0; font-size: 13px; color: ${TEXT_MUTED};">Lengkapi detail acara, foto galeri, hingga musik latar pilihan.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div style="display: flex; align-items: flex-start;">
                        <span style="background-color: #ffffff; color: ${BRAND_COLOR}; font-weight: 800; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; line-height: 20px; text-align: center; margin-right: 12px; border: 1px solid #E5E7EB; flex-shrink: 0;">3</span>
                        <div>
                          <strong style="color: #111827; font-size: 14px;">Kelola Daftar Tamu</strong>
                          <p style="margin: 4px 0 0; font-size: 13px; color: ${TEXT_MUTED};">Kirim undangan secara otomatis melalui integrasi WhatsApp.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(168, 129, 50, 0.2);">
                  Buka Dashboard Sekarang
                </a>
              </div>
            </td>
          </tr>
        </table>
        ${FOOTER_HTML(year)}
      </td>
    </tr>
  </table>
</body>
</html>
`;

  await transporter.sendMail({
    from: `"Vowify.id" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Selamat Datang di Vowify.id!`,
    html,
  });
}
