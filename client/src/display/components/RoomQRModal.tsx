import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Smartphone, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import { useGameStore } from '../../shared/store/useGameStore';
import { socketClient } from '../../shared/socket/socketClient';

interface RoomQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomQRModal: React.FC<RoomQRModalProps> = ({ isOpen, onClose }) => {
  const room = useGameStore((s) => s.room);
  const qrCodeUrl = useGameStore((s) => s.qrCodeUrl);
  const isControllerConnected = useGameStore((s) => s.isControllerConnected);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !room) {
      setLoading(true);
      socketClient.createRoom();
    }
  }, [isOpen, room]);

  useEffect(() => {
    if (room?.code) {
      // Fetch QR Code data URL from server or fallback generator
      const fetchQr = async () => {
        try {
          const res = await fetch(`/api/qrcode?room=${room.code}&host=${encodeURIComponent(window.location.origin)}`);
          if (res.ok) {
            const data = await res.json();
            setQrImage(data.qrCode);
          }
        } catch (e) {
          console.error('Failed to fetch QR code from backend:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchQr();
    }
  }, [room?.code]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel-glow max-w-lg w-full p-8 rounded-3xl border border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-2 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] mb-4 border border-[#00f0ff]/30">
          <Smartphone className="w-7 h-7" />
        </div>

        <h2 className="text-3xl font-black font-heading tracking-wider mb-2 text-slate-100">
          CONNECT YOUR PHONE GUN
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Scan the QR Code with your mobile phone browser to initialize motion controls.
        </p>

        {/* QR Code Container */}
        <div className="relative inline-block p-4 rounded-2xl bg-[#0a0f1d] border border-[#00f0ff]/40 mb-6 shadow-inner">
          {loading || !qrImage ? (
            <div className="w-64 h-64 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-10 h-10 border-4 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono-tech">GENERATING SECURE ROOM...</span>
            </div>
          ) : (
            <div className="relative">
              <img src={qrImage} alt="Scan QR Code" className="w-64 h-64 rounded-xl shadow-lg" />
              {isControllerConnected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-[#060913]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4 border-2 border-[#00f0ff]"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#00f0ff] animate-bounce mb-2" />
                  <span className="text-xl font-bold font-heading text-[#00f0ff]">GUN CONNECTED!</span>
                  <span className="text-xs text-slate-300 font-mono-tech mt-1">READY TO FIRE</span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Room Code Badge */}
        {room?.code && (
          <div className="mb-6">
            <div className="text-xs text-slate-400 font-mono-tech uppercase mb-1">ROOM CODE</div>
            <div className="text-4xl font-black font-mono-tech tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 py-2 rounded-xl inline-block px-6 border border-[#00f0ff]/30">
              {room.code}
            </div>
          </div>
        )}

        {/* Start Game Button once phone connected */}
        {isControllerConnected ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              socketClient.sendGameStart();
              useGameStore.getState().startGame();
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a2ff] text-slate-950 font-black font-heading text-lg tracking-wider glow-btn-cyan cursor-pointer flex items-center justify-center gap-3"
          >
            <span>START MISSION NOW</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        ) : (
          <div className="text-xs text-slate-400 font-mono-tech animate-pulse">
            WAITING FOR MOBILE PHONE SENSOR HANDSHAKE...
          </div>
        )}
      </motion.div>
    </div>
  );
};
