import React from 'react';
import { Compass } from 'lucide-react';
import { OrientationData } from '@gunlink/shared';

interface OrientationPreviewProps {
  orientation: OrientationData;
}

export const OrientationPreview: React.FC<OrientationPreviewProps> = ({ orientation }) => {
  return (
    <div className="w-full max-w-sm px-4 mb-3">
      <div className="glass-panel p-3 rounded-xl border border-[#00f0ff]/20 flex items-center justify-between text-xs font-mono-tech text-slate-300">
        <div className="flex items-center gap-2 text-[#00f0ff]">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>GYRO RADAR</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PITCH: <strong className="text-slate-100">{orientation.beta.toFixed(0)}°</strong></span>
          <span>YAW: <strong className="text-slate-100">{orientation.alpha.toFixed(0)}°</strong></span>
        </div>
      </div>
    </div>
  );
};
