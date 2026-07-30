import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, Sliders, ShieldAlert, KeyRound, QrCode, Camera, Sun, Moon } from 'lucide-react';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { TriggerButton } from './components/TriggerButton';
import { QuickActions } from './components/QuickActions';
import { OrientationPreview } from './components/OrientationPreview';
import { SettingsDrawer } from './components/SettingsDrawer';
import { QRCameraScanner } from './components/QRCameraScanner';
import { socketClient } from '../shared/socket/socketClient';
import { useGameStore } from '../shared/store/useGameStore';

export const ControllerView: React.FC = () => {
  const { currentOrientation, permissionGranted, requestPermission } = useDeviceOrientation();
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState<boolean>(false);

  const [sensitivity, setSensitivity] = useState<number>(1.5);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const theme = useGameStore((s) => s.theme);
  const toggleTheme = useGameStore((s) => s.toggleTheme);
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

  const handleScanSuccess = (scannedCode: string) => {
    setInputCode(scannedCode);
    setRoomCode(scannedCode);
    socketClient.joinRoom(scannedCode);
    setIsJoined(true);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between select-none touch-none overflow-hidden transition-colors ${theme === 'dark' ? 'bg-[#060913] text-slate-100 dark' : 'bg-slate-100 text-slate-900 light'}`}>
      {/* Header Bar */}
      <header className="w-full px-4 py-3 flex items-center justify-between glass-panel border-b border-[#00f0ff]/20">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#00f0ff]" />
          <span className="font-heading font-extrabold text-sm text-[#00f0ff] tracking-wider">GUNLINK CONTROLLER</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech">
          {isJoined && (
            <div className="flex items-center gap-1.5 bg-[#00f0ff]/10 px-2.5 py-1 rounded-lg border border-[#00f0ff]/30 text-[#00f0ff]">
              <Wifi className="w-3.5 h-3.5" />
              <span>{latencyMs}ms</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="p-2 text-slate-300 hover:text-[#00f0ff] cursor-pointer">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

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
          <h2 className="text-2xl font-black font-heading mb-2">ENABLE GYROSCOPE</h2>
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
        /* Dual Entry Options Step (QR Camera Scanner OR Manual Code Input) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] mb-4">
            <KeyRound className="w-7 h-7" />
          </div>

          <h2 className="text-3xl font-black font-heading mb-1">PAIR WITH DISPLAY</h2>
          <p className="text-slate-400 text-xs font-mono-tech mb-6 uppercase tracking-wider">
            SCAN QR CODE OR ENTER THE 6-CHARACTER ROOM CODE
          </p>

          <div className="w-full max-w-xs space-y-4">
            {/* Live Camera Scanner Trigger */}
            <button
              onClick={() => setIsCameraScannerOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-[#00f0ff]/15 border-2 border-[#00f0ff]/40 text-[#00f0ff] font-heading font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-[#00f0ff]/25 transition-all cursor-pointer shadow-md"
            >
              <Camera className="w-5 h-5" />
              <span>SCAN QR CODE WITH CAMERA</span>
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div>
              <div className="relative flex justify-center text-xs text-slate-400 font-mono-tech bg-[#060913] px-2 uppercase">OR ENTER MANUAL CODE</div>
            </div>

            {/* Manual Code Input */}
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
              CONNECT ROOM CODE
            </button>
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

      {/* Live Camera Scanner Modal */}
      <QRCameraScanner
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};
