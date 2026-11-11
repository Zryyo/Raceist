import React, { useEffect } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Camera, Home, Flag, Award } from 'lucide-react';
import { CircuitDefinition, CarLivery } from '../types/game';
import { CIRCUITS } from '../game/tracks';
import { CAR_LIVERIES } from '../game/carLiveries';

interface PauseModalProps {
  isOpen: boolean;
  track: CircuitDefinition;
  livery: CarLivery;
  soundEnabled: boolean;
  cameraMode: 'chase' | 'overview';
  volume: number;
  onResume: () => void;
  onRestartLap: () => void;
  onSelectTrack: (track: CircuitDefinition) => void;
  onSelectLivery: (livery: CarLivery) => void;
  onToggleSound: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleCamera: () => void;
  onReturnToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  track,
  livery,
  soundEnabled,
  cameraMode,
  volume,
  onResume,
  onRestartLap,
  onSelectTrack,
  onSelectLivery,
  onToggleSound,
  onVolumeChange,
  onToggleCamera,
  onReturnToMenu
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onResume();
      } else if (e.key === 'r' || e.key === 'R') {
        onRestartLap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onResume, onRestartLap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150 select-none font-racing">
      <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-red-600 rotate-45 inline-block" />
            <h2 className="text-2xl font-black italic tracking-wide uppercase text-white">
              SESSION PAUSED
            </h2>
          </div>
          <span className="text-xs font-sans text-slate-400">Press ESC to Resume</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onResume}
            className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-black text-lg italic tracking-wider uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Play size={18} className="fill-white" />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestartLap}
            className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base tracking-wide uppercase rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>RESTART LAP (R)</span>
          </button>
        </div>

        {/* Audio & Camera Controls */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
          {/* Sound & Volume */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-sans font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                {soundEnabled ? <Volume2 size={15} className="text-red-500" /> : <VolumeX size={15} />}
                Audio Output
              </span>
              <button
                onClick={onToggleSound}
                className="text-[11px] text-red-400 hover:underline cursor-pointer"
              >
                {soundEnabled ? 'MUTE' : 'UNMUTE'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Camera View Mode */}
          <div className="flex flex-col gap-2 border-l border-slate-800 pl-3">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-slate-300">
              <Camera size={15} className="text-blue-400" />
              <span>Camera Perspective</span>
            </div>
            <button
              onClick={onToggleCamera}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium rounded border border-slate-700 transition-colors text-center cursor-pointer"
            >
              {cameraMode === 'chase' ? 'Dynamic Chase Camera' : 'Full Circuit Overview'}
            </button>
          </div>
        </div>

        {/* Change Track & Livery Quick Pick */}
        <div className="flex flex-col gap-3">
          {/* Quick Track Switch */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-slate-400 uppercase">
              <Flag size={13} className="text-red-500" />
              <span>Switch Circuit</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {CIRCUITS.map((c) => {
                const shortName = c.name
                  .replace('Autodromo Nazionale', '')
                  .replace('Circuit de', '')
                  .replace('Circuit of the', '')
                  .replace('Autódromo', '')
                  .replace('International Circuit', '')
                  .replace('Street Circuit', '')
                  .replace('Circuit', '')
                  .trim()
                  .split(' ')[0];
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectTrack(c)}
                    className={`p-1.5 rounded border text-xs text-center transition-colors cursor-pointer ${
                      c.id === track.id
                        ? 'bg-red-950/70 border-red-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                    title={c.name}
                  >
                    <span className="block text-sm">{c.flag}</span>
                    <span className="truncate block mt-0.5 text-[11px] font-racing">{shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Livery Switch */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-slate-400 uppercase">
              <Award size={13} className="text-amber-500" />
              <span>Switch Constructor</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {CAR_LIVERIES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onSelectLivery(l)}
                  className={`p-2 rounded border flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    l.id === livery.id
                      ? 'bg-slate-800 border-red-500 ring-1 ring-red-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/50"
                    style={{ backgroundColor: l.chassisColor }}
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1">#{l.number}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Main Menu Return */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <button
            onClick={onReturnToMenu}
            className="text-xs font-sans text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home size={14} />
            <span>Return to Title Menu</span>
          </button>
          <span className="text-xs text-slate-500 font-sans">Apex Grid Sim</span>
        </div>
      </div>
    </div>
  );
};
