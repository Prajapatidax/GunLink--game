import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import { socketClient } from '../../shared/socket/socketClient';

interface TriggerButtonProps {
  vibrationEnabled: boolean;
}

export const TriggerButton: React.FC<TriggerButtonProps> = ({ vibrationEnabled }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleFire = () => {
    setIsPressed(true);

    // Haptic feedback
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([30]);
    }

    // Send instant trigger event
    socketClient.sendTriggerPull();

    setTimeout(() => setIsPressed(false), 120);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4">
      <motion.button
        whileTap={{ scale: 0.94 }}
        onTouchStart={handleFire}
        onClick={handleFire}
        className={`w-full max-w-sm h-64 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-75 cursor-pointer touch-none select-none border-2 ${
          isPressed
            ? 'bg-[#00f0ff] border-white shadow-[0_0_60px_#00f0ff] text-slate-950 scale-95'
            : 'glass-panel-glow border-[#00f0ff]/50 text-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.2)]'
        }`}
      >
        <Crosshair className={`w-20 h-20 ${isPressed ? 'animate-ping' : 'animate-pulse'}`} />
        <span className="text-3xl font-black font-heading tracking-widest uppercase">
          {isPressed ? 'FIRING!' : 'PULL TRIGGER'}
        </span>
      </motion.button>
    </div>
  );
};
