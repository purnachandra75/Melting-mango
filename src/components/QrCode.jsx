import { useMemo } from 'react';
import QRCode from 'qrcode';

/**
 * QR code drawn as inline SVG (synchronous, so it is already on screen when the card is captured
 * for the PDF / print). Dark modules on white with a quiet-zone border so phone cameras read it.
 */
export default function QrCode({ value, label = 'QR code', className = '' }) {
  const { size, path } = useMemo(() => {
    const qr = QRCode.create(value, { errorCorrectionLevel: 'M' });
    const n = qr.modules.size;
    const data = qr.modules.data;
    let d = '';
    for (let y = 0; y < n; y += 1) {
      for (let x = 0; x < n; x += 1) {
        if (data[y * n + x]) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return { size: n, path: d };
  }, [value]);

  const quiet = 2;
  const total = size + quiet * 2;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      <rect width={total} height={total} fill="#fff" />
      <path transform={`translate(${quiet} ${quiet})`} d={path} fill="#000" />
    </svg>
  );
}
