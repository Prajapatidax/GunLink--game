import React from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { socketClient } from '../../shared/socket/socketClient';

interface QuickActionsProps {
  vibrationEnabled: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ vibrationEnabled }) => {
  const handleReload = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([15, 30, 15]);
    }
    socketClient.sendReload();
  };

  const handleRecenter = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([20]);
    }
    socketClient.sendRecenter();
  };

  return (
    <div className="w-full max-w-sm grid grid-cols-2 gap-4 px-4 pb-4">
      <button
        onClick={handleReload}
        className="glass-panel py-4 px-4 rounded-2xl border border-amber-400/40 text-amber-400 font-heading font-bold flex items-center justify-center gap-2 hover:bg-amber-400/10 active:scale-95 transition-all cursor-pointer"
      >
        <RefreshCw className="w-5 h-5" />
        <span>RELOAD</span>
      </button>

      <button
        onClick={handleRecenter}
        className="glass-panel py-4 px-4 rounded-2xl border border-[#00f0ff]/40 text-[#00f0ff] font-heading font-bold flex items-center justify-center gap-2 hover:bg-[#00f0ff]/10 active:scale-95 transition-all cursor-pointer"
      >
        <RotateCcw className="w-5 h-5" />
        <span>RECENTER</span>
      </button>
    </div>
  );
};
