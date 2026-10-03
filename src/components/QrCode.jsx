import { useMemo } from 'react';
import QRCode from 'qrcode';

// Renders a QR code as a PNG data URL, computed synchronously. The PDF is
// made by html2canvas photographing the certificate, so the code has to be
// a plain, already-decoded image the moment the certificate is on screen —
// an async render could be photographed half-drawn or not at all.
export default function QrCode({ value, size = 104, className = '' }) {
  const src = useMemo(() => {
    if (!value || typeof document === 'undefined') return null;
    try {
      const { modules } = QRCode.create(value, { errorCorrectionLevel: 'M' });
      const n = modules.size;
      const quiet = 2; // white border so scanners can find the edges
      const scale = Math.max(2, Math.ceil(size / (n + quiet * 2)) * 2);
      const px = (n + quiet * 2) * scale;
      const canvas = document.createElement('canvas');
      canvas.width = px;
      canvas.height = px;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, px, px);
      ctx.fillStyle = '#123d2f';
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          if (modules.data[row * n + col]) {
            ctx.fillRect((col + quiet) * scale, (row + quiet) * scale, scale, scale);
          }
        }
      }
      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  }, [value, size]);

  if (!src) return null;
  return <img src={src} width={size} height={size} alt="" className={className} />;
}
