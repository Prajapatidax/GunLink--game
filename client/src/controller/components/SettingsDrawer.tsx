import React, { useEffect, useState } from 'react';
import { Sliders, Volume2, Smartphone, ShieldCheck, Sun, Maximize } from 'lucide-react';
import { socketClient } from '../../shared/socket/socketClient';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sensitivity: number;
  onSensitivityChange: (val: number) => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  sensitivity,
  onSensitivityChange,
  vibrationEnabled,
  onToggleVibration
}) => {
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Screen Wake Lock API
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        await (navigator as any).wakeLock.request('screen');
        setWakeLockActive(true);
      } catch (err) {
        console.warn('Wake Lock failed:', err);
      }
    }
  };

  useEffect(() => {
    requestWakeLock();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center">
      <div className="glass-panel-glow w-full max-w-md p-6 rounded-t-3xl border-t border-[#00f0ff]/40">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-lg font-heading font-bold text-[#00f0ff]">
            <Sliders className="w-5 h-5" />
            <span>GUN CONTROLLER SETTINGS</span>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold px-3 py-1 bg-slate-800 rounded-lg text-sm">
            DONE
          </button>
        </div>

        <div className="space-y-6">
          {/* Sensitivity Slider */}
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-300">Aim Sensitivity</span>
              <span className="text-[#00f0ff] font-mono-tech">{sensitivity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={sensitivity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onSensitivityChange(val);
                socketClient.sendSensitivity(val);
              }}
              className="w-full accent-[#00f0ff] cursor-pointer"
            />
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Haptic Vibration</span>
            <button
              onClick={onToggleVibration}
              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                vibrationEnabled ? 'bg-[#00f0ff] text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {vibrationEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Keep Screen Awake</span>
            <span className="text-xs font-mono-tech text-[#00f0ff]">
              {wakeLockActive ? 'WAKE LOCK ACTIVE' : 'UNSUPPORTED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
