import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCode({ value, size = 168 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, { width: size * 2, margin: 1, color: { dark: "#0c2a4e", light: "#ffffff" } }).then(
      (url) => {
        if (!cancelled) setDataUrl(url);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return <div className="bg-soft rounded-2xl animate-pulse" style={{ width: size, height: size }} aria-hidden="true" />;
  }

  return (
    <img
      src={dataUrl}
      alt="Booking access QR code"
      width={size}
      height={size}
      className="rounded-2xl border border-border/60"
    />
  );
}
