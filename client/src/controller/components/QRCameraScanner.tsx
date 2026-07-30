import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

interface QRCameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (roomCode: string) => void;
}

export const QRCameraScanner: React.FC<QRCameraScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animFrame: number;

    if (isOpen) {
      setErrorMsg(null);
      setIsScanning(true);

      // Access mobile rear camera
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play();
          }

          // Use BarcodeDetector API if supported natively on mobile browser
          if ('BarcodeDetector' in window) {
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });

            const scanLoop = async () => {
              if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                try {
                  const barcodes = await detector.detect(videoRef.current);
                  if (barcodes.length > 0) {
                    const rawValue = barcodes[0].rawValue;
                    // Extract room code query param from scanned URL (e.g. ...room=WRHDJ8)
                    const match = rawValue.match(/room=([A-Z0-9]{4,8})/i);
                    if (match && match[1]) {
                      onScanSuccess(match[1].toUpperCase());
                      handleClose();
                      return;
                    }
                  }
                } catch (e) {
                  // Frame capture error ignored
                }
              }
              animFrame = requestAnimationFrame(scanLoop);
            };
            animFrame = requestAnimationFrame(scanLoop);
          }
        })
        .catch((err) => {
          console.error('Camera access error:', err);
          setErrorMsg('Camera access denied. Please enter the 6-character room code manually.');
        });
    }

    const handleClose = () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsScanning(false);
    };

    return () => {
      handleClose();
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#00f0ff] font-heading font-bold text-sm">
          <Camera className="w-5 h-5" />
          <span>CAMERA QR SCANNER</span>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative w-full max-w-sm h-80 rounded-3xl overflow-hidden border-2 border-[#00f0ff]/50 bg-slate-950 flex flex-col items-center justify-center">
        {errorMsg ? (
          <div className="p-6 text-center text-red-400 text-xs font-mono-tech flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10" />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
            {/* Viewfinder Target Box */}
            <div className="absolute inset-12 border-2 border-[#00f0ff] rounded-2xl animate-pulse-ring pointer-events-none" />
            <div className="absolute bottom-4 text-xs font-mono-tech text-[#00f0ff] bg-black/60 px-4 py-1 rounded-full backdrop-blur-sm">
              ALIGN QR CODE INSIDE FRAME
            </div>
          </>
        )}
      </div>

      <div className="w-full max-w-sm text-center">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-slate-800 text-slate-200 font-heading font-bold text-sm cursor-pointer"
        >
          ENTER CODE MANUALLY INSTEAD
        </button>
      </div>
    </div>
  );
};
