import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Target, Volume2, VolumeX, Smartphone, RefreshCw, Activity } from 'lucide-react';
import { useGameStore } from '../../shared/store/useGameStore';
import { socketClient } from '../../shared/socket/socketClient';

export const HUD: React.FC = () => {
  const aimPitchYaw = useGameStore((s) => s.aimPitchYaw);
  const ammo = useGameStore((s) => s.ammo);
  const maxAmmo = useGameStore((s) => s.maxAmmo);
  const isReloading = useGameStore((s) => s.isReloading);
  const score = useGameStore((s) => s.score);
  const combo = useGameStore((s) => s.combo);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const isControllerConnected = useGameStore((s) => s.isControllerConnected);
  const latencyMs = useGameStore((s) => s.latencyMs);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const gamePhase = useGameStore((s) => s.gamePhase);

  // Recoil crosshair pulse
  const recoilTriggered = useGameStore((s) => s.recoilTriggered);
  const [crosshairPulse, setCrosshairPulse] = useState(false);

  useEffect(() => {
    if (recoilTriggered > 0) {
      setCrosshairPulse(true);
      const t = setTimeout(() => setCrosshairPulse(false), 120);
      return () => clearTimeout(t);
    }
  }, [recoilTriggered]);

  // Convert aim pitch & yaw to screen pixel coordinates for crosshair offset
  // Pitch (rad) maps to Y %, Yaw (rad) maps to X %
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const crosshairX = screenWidth / 2 + Math.tan(aimPitchYaw.yaw) * (screenWidth * 0.45);
  const crosshairY = screenHeight / 2 - Math.tan(aimPitchYaw.pitch) * (screenHeight * 0.45);

  const clampedX = Math.max(80, Math.min(screenWidth - 80, crosshairX));
  const clampedY = Math.max(80, Math.min(screenHeight - 80, crosshairY));

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 select-none">
      {/* Dynamic Crosshair tracking motion */}
      {gamePhase === 'PLAYING' && (
        <div
          className="absolute z-30 transition-transform duration-75 ease-out"
          style={{
            left: `${clampedX}px`,
            top: `${clampedY}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`relative flex items-center justify-center ${crosshairPulse ? 'scale-130' : 'scale-100'}`}>
            {/* Center Dot */}
            <div className="w-2.5 h-2.5 bg-[#00f0ff] rounded-full shadow-[0_0_12px_#00f0ff]" />

            {/* Outer Target Reticle Rings */}
            <div className="absolute w-12 h-12 border-2 border-[#00f0ff]/60 rounded-full animate-pulse-ring" />
            <div className="absolute w-16 h-16 border border-dashed border-[#00f0ff]/40 rounded-full" />

            {/* Reticle Crosshairs */}
            <div className="absolute w-6 h-0.5 bg-[#00f0ff] -left-8" />
            <div className="absolute w-6 h-0.5 bg-[#00f0ff] -right-8" />
            <div className="absolute h-6 w-0.5 bg-[#00f0ff] -top-8" />
            <div className="absolute h-6 w-0.5 bg-[#00f0ff] -bottom-8" />
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full">
        {/* Connection Status Badge */}
        <div className="flex items-center gap-3">
          <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border border-[#00f0ff]/30">
            <Smartphone className={`w-5 h-5 ${isControllerConnected ? 'text-[#00f0ff] animate-pulse' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs text-slate-400 font-mono-tech tracking-wider uppercase">Gun Controller</div>
              <div className="text-sm font-bold font-heading flex items-center gap-2">
                {isControllerConnected ? (
                  <span className="text-[#00f0ff] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" /> CONNECTED
                  </span>
                ) : (
                  <span className="text-amber-400">WAITING FOR PHONE...</span>
                )}
              </div>
            </div>
          </div>

          {/* Latency Badge */}
          {isControllerConnected && (
            <div className="glass-panel px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-mono-tech text-slate-300">
              <Activity className="w-4 h-4 text-[#00f0ff]" />
              <span>{latencyMs}ms</span>
            </div>
          )}
        </div>

        {/* Center Timer Display */}
        <div className="glass-panel px-8 py-3 rounded-2xl flex flex-col items-center border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <div className="text-xs text-[#00f0ff] font-mono-tech tracking-widest uppercase">TIME REMAINING</div>
          <div className={`text-4xl font-black font-heading ${timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>
            00:{timeRemaining < 10 ? `0${timeRemaining}` : timeRemaining}
          </div>
        </div>

        {/* Audio Toggle & Dev Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={toggleSound}
            className="glass-panel p-3 rounded-xl hover:bg-[#00f0ff]/20 text-[#00f0ff] transition-all cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Bottom HUD: Score, Combo & Ammo */}
      <div className="flex items-end justify-between w-full mt-auto">
        {/* Score & Combo */}
        <div className="flex items-end gap-6">
          <div className="glass-panel px-6 py-4 rounded-2xl border border-[#00f0ff]/30">
            <div className="text-xs text-slate-400 font-mono-tech tracking-widest uppercase">SCORE</div>
            <div className="text-5xl font-black font-heading text-cyan-glow text-[#00f0ff]">
              {score.toLocaleString()}
            </div>
          </div>

          {combo > 1 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-panel-glow px-5 py-3 rounded-2xl flex items-center gap-3 border border-amber-400/50"
            >
              <Zap className="w-6 h-6 text-amber-400 animate-bounce" />
              <div>
                <div className="text-xs text-amber-400 font-mono-tech font-bold">COMBO STREAK</div>
                <div className="text-2xl font-extrabold font-heading text-amber-300">{combo}x MULTIPLIER</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Weapon Ammo Indicator */}
        <div className="glass-panel px-7 py-4 rounded-2xl border border-[#00f0ff]/40 flex flex-col items-end min-w-[240px]">
          <div className="text-xs text-slate-400 font-mono-tech tracking-widest uppercase mb-2 flex items-center gap-2">
            <span>PISTOL AMMO</span>
            {isReloading && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />}
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            {Array.from({ length: maxAmmo }).map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-8 rounded-sm transition-all duration-150 ${
                  idx < ammo
                    ? 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="text-2xl font-black font-heading">
            {isReloading ? (
              <span className="text-amber-400 animate-pulse text-xl">RELOADING...</span>
            ) : (
              <span className="text-slate-100">
                {ammo} <span className="text-slate-500 text-lg">/ {maxAmmo}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
