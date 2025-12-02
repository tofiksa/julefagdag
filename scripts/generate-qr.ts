import QRCode from 'qrcode';
import { writeFileSync } from 'fs';
import { join } from 'path';

const url = 'https://julefagdag.vercel.app/';
const outputPath = join(process.cwd(), 'public', 'qr-code.png');

async function generateQRCode() {
  try {
    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      errorCorrectionLevel: 'H',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Save to public folder
    writeFileSync(outputPath, qrCodeBuffer);
    console.log(`✅ QR-kode generert og lagret til: ${outputPath}`);
    console.log(`📱 URL: ${url}`);
  } catch (error) {
    console.error('❌ Feil ved generering av QR-kode:', error);
    process.exit(1);
  }
}

generateQRCode();

