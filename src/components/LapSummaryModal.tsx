import React, { useEffect } from 'react';
import { Trophy, Play, Flag, Home, Zap } from 'lucide-react';
import { CircuitDefinition, SectorTimes } from '../types/game';

interface LapSummaryModalProps {
  isOpen: boolean;
  lapTime: number;
  isBest: boolean;
  sectors: SectorTimes;
  track: CircuitDefinition;
  onContinue: () => void;
  onChangeCircuit: () => void;
  onReturnToMenu: () => void;
}

export const LapSummaryModal: React.FC<LapSummaryModalProps> = ({
  isOpen,
  lapTime,
  isBest,
  sectors,
  track,
  onContinue,
  onChangeCircuit,
  onReturnToMenu
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onContinue]);

  if (!isOpen) return null;

  const formatLapTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200 select-none font-racing">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 text-slate-100">
        {/* Record Badge */}
        <div className="text-center flex flex-col items-center">
          {isBest ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-950/90 border border-purple-500/80 rounded-full text-purple-300 text-xs font-sans font-bold uppercase tracking-widest shadow-lg shadow-purple-500/30 animate-pulse mb-3">
              <Trophy size={14} className="text-yellow-400" />
              <span>NEW PERSONAL BEST LAP</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400 text-xs font-sans font-bold uppercase tracking-widest mb-3">
              <Flag size={14} className="text-red-500" />
              <span>LAP COMPLETED</span>
            </div>
          )}

          <div className="text-xs font-sans text-slate-400 uppercase tracking-widest">
            {track.name} · {track.countryCode}
          </div>

          <div
            className={`text-5xl md:text-6xl font-black font-telemetry tracking-tight leading-none mt-2 ${
              isBest ? 'text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'text-white'
            }`}
          >
            {formatLapTime(lapTime)}
          </div>
        </div>

        {/* Sector Breakdown */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/80">
          <div className="flex flex-col items-center p-2 rounded bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-sans text-slate-400 uppercase font-bold">Sector 1</span>
            <span className="text-lg font-telemetry font-bold text-slate-100 mt-1">
              {sectors.s1 ? `${sectors.s1.toFixed(3)}s` : '--'}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-sans text-slate-400 uppercase font-bold">Sector 2</span>
            <span className="text-lg font-telemetry font-bold text-slate-100 mt-1">
              {sectors.s2 ? `${sectors.s2.toFixed(3)}s` : '--'}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-sans text-slate-400 uppercase font-bold">Sector 3</span>
            <span className="text-lg font-telemetry font-bold text-slate-100 mt-1">
              {sectors.s3 ? `${sectors.s3.toFixed(3)}s` : '--'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onContinue}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white font-racing text-xl font-black italic tracking-wide uppercase rounded-lg shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer"
          >
            <Play size={18} className="fill-white" />
            <span>CONTINUE HOTLAPPING (SPACE)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onChangeCircuit}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-sans text-xs font-semibold uppercase rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flag size={14} />
              <span>Change Circuit</span>
            </button>

            <button
              onClick={onReturnToMenu}
              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-sans text-xs font-semibold uppercase rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home size={14} />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
