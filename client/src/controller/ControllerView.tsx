import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Sliders, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { TriggerButton } from './components/TriggerButton';
import { QuickActions } from './components/QuickActions';
import { OrientationPreview } from './components/OrientationPreview';
import { SettingsDrawer } from './components/SettingsDrawer';
import { socketClient } from '../shared/socket/socketClient';
import { useGameStore } from '../shared/store/useGameStore';

export const ControllerView: React.FC = () => {
  const { currentOrientation, permissionGranted, requestPermission } = useDeviceOrientation();
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);

  const [sensitivity, setSensitivity] = useState<number>(1.5);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const isSocketConnected = useGameStore((s) => s.isSocketConnected);
  const latencyMs = useGameStore((s) => s.latencyMs);

  // Extract room from query params (e.g., /#/controller?room=CODE)
  useEffect(() => {
    socketClient.init();

    const searchParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
    const codeParam = searchParams.get('room');

    if (codeParam) {
      const codeUpper = codeParam.toUpperCase();
      setRoomCode(codeUpper);
      setInputCode(codeUpper);
      socketClient.joinRoom(codeUpper);
      setIsJoined(true);
    }
  }, []);

  const handleManualJoin = () => {
    if (!inputCode) return;
    const codeUpper = inputCode.toUpperCase();
    setRoomCode(codeUpper);
    socketClient.joinRoom(codeUpper);
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#060913] text-slate-100 flex flex-col justify-between select-none touch-none overflow-hidden">
      {/* Header Bar */}
      <header className="w-full px-4 py-3 flex items-center justify-between glass-panel border-b border-[#00f0ff]/20">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#00f0ff]" />
          <span className="font-heading font-extrabold text-sm text-[#00f0ff] tracking-wider">GUNLINK CONTROLLER</span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-1.5 bg-[#00f0ff]/10 px-2.5 py-1 rounded-lg border border-[#00f0ff]/30 text-[#00f0ff]">
            <Wifi className="w-3.5 h-3.5" />
            <span>{latencyMs}ms</span>
          </div>

          <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-slate-300 hover:text-[#00f0ff]">
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content View */}
      {!permissionGranted ? (
        /* Permission Grant Step */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="w-16 h-16 text-[#00f0ff] animate-bounce mb-4" />
          <h2 className="text-2xl font-black font-heading mb-2">ENABLE MOTION SENSORS</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            GunLink requires mobile Gyroscope access to translate physical phone movement into in-game aiming.
          </p>
          <button
            onClick={requestPermission}
            className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0088ff] text-slate-950 font-black font-heading text-lg glow-btn-cyan cursor-pointer"
          >
            ACTIVATE GYROSCOPE
          </button>
        </div>
      ) : !isJoined ? (
        /* Manual Room Entry Step */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-black font-heading mb-4">ENTER ROOM CODE</h2>
          <input
            type="text"
            maxLength={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="6-LETTER CODE"
            className="w-full max-w-xs text-center text-3xl font-mono-tech font-bold py-3 rounded-2xl bg-[#0a0f1d] border-2 border-[#00f0ff]/40 text-[#00f0ff] mb-4 uppercase tracking-widest outline-none focus:border-[#00f0ff]"
          />
          <button
            onClick={handleManualJoin}
            className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a2ff] text-slate-950 font-black font-heading text-lg glow-btn-cyan cursor-pointer"
          >
            PAIR WITH DISPLAY
          </button>
        </div>
      ) : (
        /* Active Gun Interface */
        <div className="flex-1 flex flex-col items-center justify-between w-full">
          {/* Motion Radar Widget */}
          <OrientationPreview orientation={currentOrientation} />

          {/* Big Trigger Button */}
          <TriggerButton vibrationEnabled={vibrationEnabled} />

          {/* Quick Actions (Reload & Recenter) */}
          <QuickActions vibrationEnabled={vibrationEnabled} />
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        sensitivity={sensitivity}
        onSensitivityChange={setSensitivity}
        vibrationEnabled={vibrationEnabled}
        onToggleVibration={() => setVibrationEnabled(!vibrationEnabled)}
      />
    </div>
  );
};
