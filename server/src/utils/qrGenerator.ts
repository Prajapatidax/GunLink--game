import QRCode from 'qrcode';

export async function generateControllerQRCode(clientHostUrl: string, roomCode: string): Promise<string> {
  const controllerUrl = `${clientHostUrl}/#/controller?room=${roomCode}`;
  try {
    const dataUrl = await QRCode.toDataURL(controllerUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#00f0ff',
        light: '#0a0f1d'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    throw err;
  }
}
