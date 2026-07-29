import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CheckCircle2, ArrowRight, X, Copy, Check, QrCode as QrIcon, Keyboard } from 'lucide-react';
import QRCode from 'qrcode';
import { useGameStore } from '../../shared/store/useGameStore';
import { socketClient } from '../../shared/socket/socketClient';

interface RoomQRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomQRModal: React.FC<RoomQRModalProps> = ({ isOpen, onClose }) => {
  const room = useGameStore((s) => s.room);
  const isControllerConnected = useGameStore((s) => s.isControllerConnected);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && !room) {
      socketClient.createRoom();
    }
  }, [isOpen, room]);

  useEffect(() => {
    if (room?.code) {
      const controllerUrl = `${window.location.origin}/#/controller?room=${room.code}`;

      // Generate QR Code instantly on client side
      QRCode.toDataURL(controllerUrl, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 320,
        color: {
          dark: '#00f0ff',
          light: '#0a0f1d'
        }
      })
        .then((url) => setQrImage(url))
        .catch(() => {
          // Fallback to backend API endpoint if client generation fails
          const serverUrl = import.meta.env.VITE_SERVER_URL || window.location.origin;
          fetch(`${serverUrl}/api/qrcode?room=${room.code}&host=${encodeURIComponent(window.location.origin)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.qrCode) setQrImage(data.qrCode);
            })
            .catch((e) => console.error('Failed to load QR code:', e));
        });
    }
  }, [room?.code]);

  const copyRoomCode = () => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel-glow max-w-lg w-full p-8 rounded-3xl border border-[#00f0ff]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-2 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] mb-3 border border-[#00f0ff]/30">
          <Smartphone className="w-7 h-7" />
        </div>

        <h2 className="text-3xl font-black font-heading tracking-wider mb-1 text-slate-100">
          CONNECT YOUR PHONE GUN
        </h2>
        <p className="text-slate-400 text-xs font-mono-tech mb-6 uppercase tracking-wider">
          TWO WAYS TO PAIR YOUR CONTROLLER
        </p>

        {/* Dual Connection Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
          {/* Method A: QR Code */}
          <div className="glass-panel p-4 rounded-2xl border border-[#00f0ff]/30 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs text-[#00f0ff] font-mono-tech mb-2 font-bold">
              <QrIcon className="w-4 h-4" />
              <span>OPTION 1: SCAN QR</span>
            </div>

            <div className="p-2 rounded-xl bg-[#0a0f1d] border border-[#00f0ff]/30 inline-block relative">
              {qrImage ? (
                <img src={qrImage} alt="Scan QR Code" className="w-36 h-36 rounded-lg shadow-md" />
              ) : (
                <div className="w-36 h-36 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <div className="w-6 h-6 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin mb-2" />
                  <span>GENERATING...</span>
                </div>
              )}

              {isControllerConnected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-[#060913]/90 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center border-2 border-[#00f0ff]"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#00f0ff] animate-bounce mb-1" />
                  <span className="text-sm font-bold font-heading text-[#00f0ff]">CONNECTED!</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Method B: Manual Code Entry */}
          <div className="glass-panel p-4 rounded-2xl border border-amber-400/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono-tech mb-2 font-bold">
                <Keyboard className="w-4 h-4" />
                <span>OPTION 2: ENTER CODE</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Open <strong className="text-slate-200">/controller</strong> on your phone and type this room code:
              </p>
            </div>

            {room?.code ? (
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-black font-mono-tech tracking-widest text-[#00f0ff] bg-[#00f0ff]/10 py-2.5 px-3 rounded-xl text-center border border-[#00f0ff]/40">
                  {room.code}
                </div>
                <button
                  onClick={copyRoomCode}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold font-mono-tech flex items-center justify-center gap-1.5 text-slate-200 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'CODE COPIED!' : 'COPY CODE'}</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono-tech text-center py-4">GENERATING...</div>
            )}
          </div>
        </div>

        {/* Start Game Action once connected */}
        {isControllerConnected ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
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
            WAITING FOR MOBILE SENSOR HANDSHAKE...
          </div>
        )}
      </motion.div>
    </div>
  );
};
