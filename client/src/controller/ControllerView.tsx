import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Sliders, ShieldAlert, KeyRound, QrCode } from 'lucide-react';
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
  const [joinError, setJoinError] = useState<string | null>(null);

  const [sensitivity, setSensitivity] = useState<number>(1.5);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const latencyMs = useGameStore((s) => s.latencyMs);

  // Extract room from URL query params (e.g. /#/controller?room=CODE)
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
    if (!inputCode || inputCode.length < 4) {
      setJoinError('Please enter a valid 6-character room code');
      return;
    }
    setJoinError(null);
    const codeUpper = inputCode.toUpperCase().trim();
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
          {isJoined && (
            <div className="flex items-center gap-1.5 bg-[#00f0ff]/10 px-2.5 py-1 rounded-lg border border-[#00f0ff]/30 text-[#00f0ff]">
              <Wifi className="w-3.5 h-3.5" />
              <span>{latencyMs}ms</span>
            </div>
          )}

          <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-slate-300 hover:text-[#00f0ff] cursor-pointer">
            <Sliders className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content View */}
      {!permissionGranted ? (
        /* Permission Grant Step */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <ShieldAlert className="w-16 h-16 text-[#00f0ff] animate-bounce mb-4" />
          <h2 className="text-2xl font-black font-heading mb-2 text-slate-100">ENABLE GYROSCOPE</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            GunLink requires smartphone physical motion sensor access to tilt and aim your weapon in real time.
          </p>
          <button
            onClick={requestPermission}
            className="w-full max-w-xs py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#0088ff] text-slate-950 font-black font-heading text-lg glow-btn-cyan cursor-pointer"
          >
            ACTIVATE MOTION SENSOR
          </button>
        </div>
      ) : !isJoined ? (
        /* Dual Entry Options Step (QR Auto-Detect OR Manual Code Input) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] mb-4">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-3xl font-black font-heading mb-1 text-slate-100">PAIR WITH DISPLAY</h2>
          <p className="text-slate-400 text-xs font-mono-tech mb-6 uppercase tracking-wider">
            ENTER THE 6-CHARACTER CODE SHOWN ON YOUR DESKTOP SCREEN
          </p>

          <div className="w-full max-w-xs space-y-4">
            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. WRHDJ8"
              className="w-full text-center text-3xl font-mono-tech font-bold py-3.5 rounded-2xl bg-[#0a0f1d] border-2 border-[#00f0ff]/40 text-[#00f0ff] uppercase tracking-widest outline-none focus:border-[#00f0ff] shadow-inner"
            />

            {joinError && <div className="text-xs text-red-400 font-mono-tech">{joinError}</div>}

            <button
              onClick={handleManualJoin}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00f0ff] to-[#00a2ff] text-slate-950 font-black font-heading text-lg glow-btn-cyan cursor-pointer"
            >
              CONNECT TO ROOM
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center text-xs text-slate-500 font-mono-tech bg-[#060913] px-2 uppercase">OR</div>
            </div>

            <div className="text-xs text-slate-400 font-mono-tech flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4 text-[#00f0ff]" />
              <span>Scan QR code using your phone camera</span>
            </div>
          </div>
        </div>
      ) : (
        /* Active Motion Gun Interface */
        <div className="flex-1 flex flex-col items-center justify-between w-full">
          {/* Room Badge */}
          <div className="w-full px-4 pt-3 flex items-center justify-between text-xs font-mono-tech">
            <span className="text-slate-400">PAIRED ROOM: <strong className="text-[#00f0ff]">{roomCode}</strong></span>
            <button onClick={() => setIsJoined(false)} className="text-amber-400 underline cursor-pointer">
              CHANGE ROOM
            </button>
          </div>

          {/* Motion Radar Widget */}
          <OrientationPreview orientation={currentOrientation} />

          {/* Touch Trigger */}
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
