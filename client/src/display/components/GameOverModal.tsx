import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Crosshair, Zap, Award } from 'lucide-react';
import { useGameStore } from '../../shared/store/useGameStore';
import { socketClient } from '../../shared/socket/socketClient';

export const GameOverModal: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const scoreData = useGameStore((s) => s.lastScoreData);
  const restartGame = useGameStore((s) => s.restartGame);

  if (gamePhase !== 'ENDED' || !scoreData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel-glow max-w-lg w-full p-8 rounded-3xl border border-[#00f0ff]/50 text-center shadow-[0_0_60px_rgba(0,240,255,0.3)] relative"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-400 mb-4 border border-amber-400/30">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-3xl font-black font-heading tracking-wider mb-1 text-slate-100">
          MISSION DEBRIEF
        </h2>
        <p className="text-slate-400 text-xs font-mono-tech mb-6">PERFORMANCE SUMMARY</p>

        {/* Final Score Hero */}
        <div className="glass-panel p-6 rounded-2xl border border-[#00f0ff]/30 mb-6">
          <div className="text-xs text-slate-400 font-mono-tech tracking-widest uppercase mb-1">FINAL SCORE</div>
          <div className="text-6xl font-black font-heading text-cyan-glow text-[#00f0ff]">
            {scoreData.score.toLocaleString()}
          </div>
        </div>

        {/* Combat Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-xl text-left border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tech mb-1">
              <Crosshair className="w-4 h-4 text-[#00f0ff]" />
              <span>ACCURACY</span>
            </div>
            <div className="text-2xl font-bold font-heading text-slate-100">{scoreData.accuracy}%</div>
          </div>

          <div className="glass-panel p-4 rounded-xl text-left border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tech mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>MAX COMBO</span>
            </div>
            <div className="text-2xl font-bold font-heading text-amber-400">{scoreData.comboMax}x</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            socketClient.sendGameRestart();
            restartGame();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a2ff] text-slate-950 font-black font-heading text-lg tracking-wider glow-btn-cyan cursor-pointer flex items-center justify-center gap-3"
        >
          <RefreshCw className="w-5 h-5" />
          <span>PLAY AGAIN</span>
        </button>
      </motion.div>
    </div>
  );
};
