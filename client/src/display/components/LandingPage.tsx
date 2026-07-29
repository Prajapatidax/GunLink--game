import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Smartphone, Shield, Zap, Award, Play, Wifi, Cpu } from 'lucide-react';
import { RoomQRModal } from './RoomQRModal';
import { LeaderboardEntry } from '@gunlink/shared';

export const LandingPage: React.FC = () => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#060913] text-slate-100 relative overflow-x-hidden bg-grid-cyber flex flex-col justify-between">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
            <Crosshair className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black font-heading tracking-widest text-cyan-glow text-[#00f0ff]">
            GUNLINK
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] font-heading font-bold text-sm hover:bg-[#00f0ff]/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>CONNECT PHONE</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-6 py-12 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono-tech uppercase mb-8"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>NEXT-GEN GYROSCOPIC REAL-TIME WEBSOCKET SHOOTER</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black font-heading tracking-wider leading-none mb-6 text-slate-100"
        >
          YOUR PHONE IS THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#00a2ff] to-[#ff0055] text-cyan-glow">
            GUN CONTROLLER
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-slate-400 text-lg md:text-xl font-medium mb-10"
        >
          No mobile apps required. Scan the QR code, aim with your phone's physical gyroscope sensors, and shoot 3D targets in real time.
        </motion.p>

        {/* Start Game Action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsQRModalOpen(true)}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0088ff] text-slate-950 font-black font-heading text-xl tracking-wider glow-btn-cyan cursor-pointer flex items-center gap-4 mb-16"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>INITIALIZE GAME LOBBY</span>
        </motion.button>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="glass-panel p-6 rounded-2xl border border-[#00f0ff]/20">
            <Smartphone className="w-8 h-8 text-[#00f0ff] mb-4" />
            <h3 className="text-lg font-bold font-heading mb-2 text-slate-200">Zero App Installation</h3>
            <p className="text-sm text-slate-400">
              Operates entirely inside modern web browsers using standard Web APIs & HTML5 motion sensors.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-[#00f0ff]/20">
            <Wifi className="w-8 h-8 text-[#00f0ff] mb-4" />
            <h3 className="text-lg font-bold font-heading mb-2 text-slate-200">Ultra-Low Latency</h3>
            <p className="text-sm text-slate-400">
              Powered by Node.js Socket.IO relays and exponential smoothing filters for instantaneous response times.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-[#00f0ff]/20">
            <Cpu className="w-8 h-8 text-[#00f0ff] mb-4" />
            <h3 className="text-lg font-bold font-heading mb-2 text-slate-200">3D Rapier Physics</h3>
            <p className="text-sm text-slate-400">
              Real-time WebGL rendering with procedural enemy state machines, recoil springs, and spatial Web Audio.
            </p>
          </div>
        </div>

        {/* Leaderboard Section */}
        {leaderboard.length > 0 && (
          <div className="w-full mt-16 text-left">
            <h3 className="text-2xl font-bold font-heading mb-6 flex items-center gap-3 text-[#00f0ff]">
              <Award className="w-6 h-6" /> GLOBAL HALL OF FAME
            </h3>
            <div className="glass-panel rounded-2xl p-4 border border-[#00f0ff]/20 overflow-hidden">
              <div className="grid grid-cols-4 text-xs text-slate-400 font-mono-tech border-b border-slate-800 pb-3 mb-3 px-4">
                <span>RANK</span>
                <span>OPERATIVE</span>
                <span>ACCURACY</span>
                <span className="text-right">SCORE</span>
              </div>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={entry.id} className="grid grid-cols-4 text-sm font-semibold items-center px-4 py-2 rounded-xl bg-slate-900/50">
                    <span className="font-mono-tech text-[#00f0ff]">#{idx + 1}</span>
                    <span className="font-heading">{entry.playerName}</span>
                    <span className="font-mono-tech text-slate-400">{entry.accuracy}%</span>
                    <span className="font-heading text-right text-amber-400">{entry.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-500 font-mono-tech border-t border-slate-900 relative z-10">
        GUNLINK REAL-TIME MOTION SHOOTER — PORTFOLIO PROJECT BY SENIOR FULL STACK ENGINEER
      </footer>

      {/* QR Code Modal */}
      <RoomQRModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};
