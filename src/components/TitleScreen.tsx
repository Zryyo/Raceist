import React, { useEffect } from 'react';
import { Play, Volume2, VolumeX, ShieldAlert, Award, Zap, Flag } from 'lucide-react';
import { CircuitDefinition, CarLivery, CrashMode } from '../types/game';
import { CIRCUITS } from '../game/tracks';
import { CAR_LIVERIES } from '../game/carLiveries';

const CRASH_MODES: Record<CrashMode, { label: string; className: string }> = {
  simcade: {
    label: 'SIMCADE (GRAVEL SLOWDOWN)',
    className: 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
  },
  hardcore: {
    label: 'PRO HARDCORE (CRASH ON BOUNDARY)',
    className: 'bg-amber-950/80 border-amber-500/80 text-amber-300'
  },
  sudden_death: {
    label: 'SUDDEN DEATH (TOUCH THE EDGE = BOOM)',
    className: 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_18px_rgba(225,6,0,0.35)]'
  }
};

interface TitleScreenProps {
  selectedTrack: CircuitDefinition;
  selectedLivery: CarLivery;
  soundEnabled: boolean;
  crashMode: CrashMode;
  onSelectTrack: (track: CircuitDefinition) => void;
  onSelectLivery: (livery: CarLivery) => void;
  onToggleSound: () => void;
  onCycleCrashMode: () => void;
  onStartGame: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedTrack,
  selectedLivery,
  soundEnabled,
  crashMode,
  onSelectTrack,
  onSelectLivery,
  onToggleSound,
  onCycleCrashMode,
  onStartGame
}) => {
  // Global Enter / Space listener to start game immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  const getRecordForTrack = (trackId: string): string => {
    try {
      const saved = localStorage.getItem(`apex_grid_${trackId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bestLapTime) {
          const sec = parsed.bestLapTime;
          const m = Math.floor(sec / 60);
          const s = Math.floor(sec % 60);
          const ms = Math.floor((sec % 1) * 1000);
          return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
        }
      }
    } catch {
      // Ignore
    }
    return '--:--.---';
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-10 select-none overflow-y-auto">
      {/* Top Bar: Brand Wordmark & Sound Toggle */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 bg-red-600 rotate-45 inline-block" />
          <span className="text-sm font-racing tracking-widest text-slate-400 uppercase font-bold">
            APEX GRID · TIME TRIAL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className={`px-3 py-1.5 rounded-lg border text-xs font-sans font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-red-600/90 text-white border-red-500 hover:bg-red-500'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Bespoke SVG Title Lockup & 35% Negative Space */}
      <div className="flex flex-col items-start max-w-3xl my-auto py-6">
        {/* Inline bespoke SVG title lockup */}
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-8 h-8 text-red-600" viewBox="0 0 32 32" fill="none">
            <path
              d="M4 24L16 4L28 24H4Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M12 24L16 16L20 24H12Z" fill="currentColor" />
          </svg>
          <span className="text-red-500 font-racing tracking-wider font-extrabold text-sm uppercase">
            Unofficial Time Attack Series
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-racing tracking-tight text-white uppercase italic leading-none drop-shadow-2xl">
          APEX GRID
        </h1>
        <p className="text-lg md:text-2xl font-light font-racing tracking-wide text-slate-300 uppercase mt-1">
          Open-Wheel Time Trial Championship
        </p>

        {/* Start Game CTA Button */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartGame}
            className="group px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-racing text-2xl font-black tracking-wide uppercase italic rounded-lg shadow-[0_0_35px_rgba(225,6,0,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 cursor-pointer"
          >
            <Play size={22} className="fill-white group-hover:scale-110 transition-transform" />
            <span>HIT THE TRACK</span>
            <span className="text-xs font-sans tracking-normal not-italic px-2 py-0.5 bg-black/30 rounded border border-white/20 text-slate-200">
              SPACE / ENTER
            </span>
          </button>

          <button
            onClick={onCycleCrashMode}
            title="Click to change crash mode"
            className={`px-4 py-3 rounded-lg border text-xs font-sans font-semibold flex items-center gap-2 transition-colors cursor-pointer ${CRASH_MODES[crashMode].className}`}
          >
            <ShieldAlert size={16} />
            <span>Mode: {CRASH_MODES[crashMode].label}</span>
          </button>
        </div>
      </div>

      {/* Bottom Area: Circuit Carousel, Car Liveries & Control Hint Line */}
      <div className="flex flex-col gap-5 pt-4 border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Circuit Selection (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-slate-400 font-semibold gap-2">
              <span className="flex items-center gap-1.5 shrink-0">
                <Flag size={14} className="text-red-500" />
                Select Circuit
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-telemetry">{CIRCUITS.length} Tracks</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
              {CIRCUITS.map((t) => {
                const isSelected = t.id === selectedTrack.id;
                const record = getRecordForTrack(t.id);
                const shortName = t.name
                  .replace('Autodromo Nazionale', '')
                  .replace('Circuit de', '')
                  .replace('Circuit of the', '')
                  .replace('Autódromo', '')
                  .replace('International Circuit', '')
                  .replace('Street Circuit', '')
                  .replace('Circuit', '')
                  .trim();
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTrack(t)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                      isSelected
                        ? 'bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base" title={t.location}>{t.flag}</span>
                        <span className="text-[9px] font-sans text-slate-400 font-bold tracking-wider">{t.difficulty}</span>
                      </div>
                      <div className="font-racing font-bold text-sm text-white mt-1 leading-tight line-clamp-1" title={t.name}>
                        {shortName || t.name}
                      </div>
                      <div className="text-[10px] font-sans text-slate-400 truncate">
                        {t.location.split(',')[0]} · {t.lengthKm} km
                      </div>
                    </div>

                    <div className="text-[10px] font-telemetry text-slate-400 flex items-center justify-between mt-1.5 pt-1 border-t border-slate-800/60">
                      <span>BEST</span>
                      <span className={record !== '--:--.---' ? 'text-emerald-400 font-bold' : ''}>{record}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Car Livery Selection (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                Select Constructor Livery
              </span>
              <span className="text-slate-300 font-mono">#{selectedLivery.number}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {CAR_LIVERIES.map((liv) => {
                const isSelected = liv.id === selectedLivery.id;
                return (
                  <button
                    key={liv.id}
                    onClick={() => onSelectLivery(liv)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                      isSelected
                        ? 'bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                        style={{ backgroundColor: liv.chassisColor }}
                      />
                      <div
                        className="w-2.5 h-2.5 rounded-full border border-black/40"
                        style={{ backgroundColor: liv.accentColor }}
                      />
                    </div>
                    <div>
                      <div className="font-racing font-bold text-xs text-white leading-tight truncate">
                        {liv.team.replace('Grand Prix', '').replace('Racing', '').trim()}
                      </div>
                      <div className="text-[10px] font-sans text-slate-400 truncate mt-0.5">
                        {liv.driver}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mandatory Single Flat Control-Hint Line */}
        <div className="flex items-center justify-center py-2 text-xs md:text-sm text-slate-400 font-sans tracking-wide">
          <span>WASD / Arrows Steer & Accelerate</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>Space ERS Boost</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>E Open DRS</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>C Toggle Camera</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>Esc Pause</span>
          <span className="mx-2 text-slate-600">·</span>
          <span>R Reset Lap</span>
        </div>
      </div>
    </div>
  );
};
