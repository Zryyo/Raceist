import React from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  RotateCcw,
  Camera,
  Flame,
  Zap,
  Gauge
} from 'lucide-react';
import { CircuitDefinition, TelemetryData } from '../types/game';

interface GameHUDProps {
  telemetry: TelemetryData | null;
  track: CircuitDefinition;
  soundEnabled: boolean;
  cameraMode: 'chase' | 'overview';
  onToggleSound: () => void;
  onToggleCamera: () => void;
  onRestartLap: () => void;
  onPause: () => void;
  onVirtualInput?: (control: 'gas' | 'brake' | 'left' | 'right' | 'ers', state: boolean) => void;
  onToggleDRS?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  telemetry,
  track,
  soundEnabled,
  cameraMode,
  onToggleSound,
  onToggleCamera,
  onRestartLap,
  onPause,
  onVirtualInput,
  onToggleDRS
}) => {
  const formatLapTime = (sec: number | null) => {
    if (sec === null || sec <= 0) return '--:--.---';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  const formatDelta = (delta: number | null) => {
    if (delta === null) return null;
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(3)}s`;
  };

  const getSectorBg = (status: 'pending' | 'green' | 'purple' | 'yellow') => {
    switch (status) {
      case 'purple':
        return 'bg-purple-600 text-white shadow-purple-500/40';
      case 'green':
        return 'bg-emerald-500 text-black font-bold shadow-emerald-500/40';
      case 'yellow':
        return 'bg-amber-500 text-black';
      default:
        return 'bg-slate-800/90 text-slate-400 border border-slate-700/60';
    }
  };

  const rpm = telemetry?.rpm ?? 0;
  const maxRpm = 14500;
  const rpmRatio = Math.max(0, Math.min(1, (rpm - 6000) / (maxRpm - 6000)));
  const totalLeds = 15;
  const activeLeds = Math.round(rpmRatio * totalLeds);
  const isRedline = rpmRatio > 0.92;

  // Mini-radar projection
  const minX = Math.min(...track.points.map((p) => p.x));
  const maxX = Math.max(...track.points.map((p) => p.x));
  const minY = Math.min(...track.points.map((p) => p.y));
  const maxY = Math.max(...track.points.map((p) => p.y));
  const radarW = 90;
  const radarH = 60;
  const pad = 6;
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const projectPoint = (x: number, y: number) => {
    const px = pad + ((x - minX) / rangeX) * (radarW - pad * 2);
    const py = pad + ((y - minY) / rangeY) * (radarH - pad * 2);
    return { px, py };
  };

  const trackPathSvg =
    track.points
      .map((pt, idx) => {
        const { px, py } = projectPoint(pt.x, pt.y);
        return `${idx === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
      })
      .join(' ') + ' Z';

  const playerDot = telemetry?.playerPos ? projectPoint(telemetry.playerPos.x, telemetry.playerPos.y) : null;
  const ghostDot = telemetry?.ghostPos ? projectPoint(telemetry.ghostPos.x, telemetry.ghostPos.y) : null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 select-none font-racing">
      {/* Top Bar: Lap Timing, Sectors, Delta & Actions */}
      <div className="flex items-start justify-between w-full">
        {/* Timing & Sectors Cluster */}
        <div className="flex flex-col gap-2">
          {/* Main Lap Time & Delta */}
          <div className="bg-slate-950/85 border border-slate-800 rounded-lg p-3 text-slate-100 shadow-xl flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] font-sans uppercase tracking-wider text-slate-400">Current Lap</span>
              <span className="text-3xl md:text-4xl font-extrabold font-telemetry tracking-tight text-white leading-none">
                {formatLapTime(telemetry?.currentLapTime ?? 0)}
              </span>
            </div>

            {/* Delta to Best */}
            {telemetry?.deltaToBest !== null && (
              <div
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded border text-sm font-telemetry font-bold ${
                  (telemetry?.deltaToBest ?? 0) <= 0
                    ? 'bg-purple-950/80 border-purple-500/70 text-purple-300'
                    : 'bg-amber-950/80 border-amber-500/70 text-amber-300'
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider opacity-75">Delta</span>
                <span>{formatDelta(telemetry?.deltaToBest ?? null)}</span>
              </div>
            )}

            {/* Best Lap */}
            <div className="border-l border-slate-800 pl-4 hidden sm:flex flex-col">
              <span className="text-[11px] font-sans uppercase tracking-wider text-slate-400">Best Lap</span>
              <span className="text-xl font-bold font-telemetry text-emerald-400 leading-none">
                {formatLapTime(telemetry?.bestLapTime ?? null)}
              </span>
            </div>
          </div>

          {/* Sector Splits (S1, S2, S3) */}
          <div className="flex items-center gap-2">
            {(['s1', 's2', 's3'] as const).map((secKey, idx) => {
              const status = telemetry?.sectorStatuses[secKey] ?? 'pending';
              const time = telemetry?.sectors[secKey];
              return (
                <div
                  key={secKey}
                  className={`flex items-center justify-between px-2.5 py-1 rounded min-w-[76px] text-xs font-telemetry uppercase transition-colors shadow-sm ${getSectorBg(
                    status
                  )}`}
                >
                  <span className="font-extrabold">S{idx + 1}</span>
                  <span className="text-[11px]">
                    {time ? `${time.toFixed(2)}s` : status === 'pending' ? '---' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Right: Track Badge & Control Actions */}
        <div className="flex flex-col items-end gap-2.5">
          {/* Circuit Info */}
          <div className="bg-slate-950/85 border border-slate-800 rounded-lg px-3.5 py-2 text-right shadow-xl">
            <div className="flex items-center justify-end gap-2 text-sm font-bold text-white">
              <span>{track.flag}</span>
              <span>{track.name}</span>
            </div>
            <div className="text-[11px] font-sans text-slate-400 flex items-center justify-end gap-1.5 mt-0.5">
              <span>{track.location}</span>
              <span>·</span>
              <span>{track.lengthKm} km</span>
              <span>·</span>
              <span className="text-red-400 font-semibold">{track.difficulty}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={onToggleCamera}
              title="Toggle Camera View (C)"
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
            >
              <Camera size={16} />
              <span className="hidden md:inline uppercase text-[11px] font-sans">
                {cameraMode === 'chase' ? 'Chase Cam' : 'Overview'}
              </span>
            </button>

            <button
              onClick={onRestartLap}
              title="Restart Lap (R)"
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={onToggleSound}
              title="Toggle Engine Audio"
              className={`p-2.5 border rounded-lg transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-red-600/90 hover:bg-red-500 text-white border-red-500'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={onPause}
              title="Pause (Esc)"
              className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
            >
              <Pause size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Alerts / Off-track Warning */}
      {telemetry?.isOffTrack && (
        <div className="self-center bg-amber-500/90 text-black px-4 py-1.5 rounded border border-amber-300 font-extrabold uppercase text-sm tracking-wider animate-pulse shadow-lg">
          GRAVEL TRAP · TRACTION LOSS
        </div>
      )}

      {/* Bottom Bar: Radar Mini-map (Left) & Steering Wheel Telemetry (Right) */}
      <div className="flex items-end justify-between w-full">
        {/* Left: Live Track Radar & Lap Count */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 text-slate-300 shadow-xl flex items-center gap-3">
          {/* Mini SVG Radar */}
          <div className="relative w-[90px] h-[60px] bg-slate-900/80 rounded border border-slate-800/80 flex items-center justify-center overflow-hidden">
            <svg width={radarW} height={radarH} className="overflow-visible">
              <path
                d={trackPathSvg}
                fill="none"
                stroke="#334155"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={trackPathSvg}
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ghost Dot */}
              {ghostDot && (
                <circle
                  cx={ghostDot.px}
                  cy={ghostDot.py}
                  r="3"
                  fill="#00E5FF"
                  className="opacity-70"
                />
              )}
              {/* Player Dot */}
              {playerDot && (
                <circle
                  cx={playerDot.px}
                  cy={playerDot.py}
                  r="3.5"
                  fill="#EF4444"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              )}
            </svg>
          </div>

          <div className="flex flex-col border-l border-slate-800 pl-3 pr-1">
            <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400">Lap</span>
            <span className="text-2xl font-black font-telemetry text-white leading-none">
              {String(telemetry?.lapNumber ?? 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-telemetry text-slate-400 mt-1">
              {telemetry?.topSpeedKmh ?? 0} KM/H
            </span>
          </div>
        </div>

        {/* Right: Digital Steering Wheel Cluster */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 md:p-4 text-slate-100 shadow-2xl flex flex-col gap-2 min-w-[260px] md:min-w-[320px]">
          {/* 1. RPM Shift Lights Bar */}
          <div className="flex items-center justify-between gap-1 pb-1">
            {Array.from({ length: totalLeds }).map((_, i) => {
              const active = i < activeLeds;
              let ledColor = 'bg-slate-800';
              if (active) {
                if (i < 5) ledColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
                else if (i < 10) ledColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
                else ledColor = 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]';
              }
              return (
                <div
                  key={i}
                  className={`h-2.5 flex-1 rounded-sm transition-all duration-75 ${ledColor} ${
                    isRedline && active ? 'animate-pulse' : ''
                  }`}
                />
              );
            })}
          </div>

          {/* 2. Core Telemetry: Gear & Speed */}
          <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
            {/* Gear Indicator */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] font-sans text-slate-400 uppercase tracking-widest">Gear</span>
              <span className="text-5xl md:text-6xl font-black font-telemetry text-red-500 leading-none">
                {telemetry?.gear ?? 1}
              </span>
            </div>

            {/* Speedometer */}
            <div className="text-right">
              <span className="text-4xl md:text-5xl font-black font-telemetry tracking-tight text-white leading-none">
                {telemetry?.speedKmh ?? 0}
              </span>
              <span className="text-xs font-sans text-slate-400 ml-1.5 uppercase font-bold tracking-wider">KM/H</span>
            </div>
          </div>

          {/* 3. DRS and ERS Energy Store */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* DRS Status */}
            <button
              onClick={onToggleDRS}
              className={`pointer-events-auto px-2.5 py-1 rounded text-xs font-sans font-black uppercase tracking-wider flex items-center gap-1 border transition-colors cursor-pointer ${
                telemetry?.drsActive
                  ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                  : telemetry?.drsAvailable
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-600 hover:bg-emerald-900'
                  : 'bg-slate-900 text-slate-600 border-slate-800'
              }`}
            >
              <Zap size={13} />
              <span>{telemetry?.drsActive ? 'DRS OPEN' : telemetry?.drsAvailable ? 'DRS READY (E)' : 'DRS OFF'}</span>
            </button>

            {/* ERS Battery Bar */}
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <Flame size={14} className={telemetry?.ersBattery && telemetry.ersBattery > 20 ? 'text-cyan-400' : 'text-slate-600'} />
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-[10px] font-telemetry font-bold text-slate-300">
                  <span>ERS</span>
                  <span className="text-cyan-400">{telemetry?.ersBattery ?? 100}%</span>
                </div>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-100"
                    style={{ width: `${telemetry?.ersBattery ?? 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* On-Screen Mobile Touch Controls (Revealed on small screens) */}
      <div className="md:hidden pointer-events-auto flex items-end justify-between w-full pt-4">
        {/* Left / Right Steering */}
        <div className="flex items-center gap-2">
          <button
            onTouchStart={() => onVirtualInput?.('left', true)}
            onTouchEnd={() => onVirtualInput?.('left', false)}
            onMouseDown={() => onVirtualInput?.('left', true)}
            onMouseUp={() => onVirtualInput?.('left', false)}
            className="w-16 h-16 rounded-xl bg-slate-900/90 border border-slate-700 active:bg-red-600 active:border-red-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg cursor-pointer"
          >
            ←
          </button>
          <button
            onTouchStart={() => onVirtualInput?.('right', true)}
            onTouchEnd={() => onVirtualInput?.('right', false)}
            onMouseDown={() => onVirtualInput?.('right', true)}
            onMouseUp={() => onVirtualInput?.('right', false)}
            className="w-16 h-16 rounded-xl bg-slate-900/90 border border-slate-700 active:bg-red-600 active:border-red-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg cursor-pointer"
          >
            →
          </button>
        </div>

        {/* Gas, Brake, and ERS */}
        <div className="flex items-center gap-2">
          <button
            onTouchStart={() => onVirtualInput?.('brake', true)}
            onTouchEnd={() => onVirtualInput?.('brake', false)}
            onMouseDown={() => onVirtualInput?.('brake', true)}
            onMouseUp={() => onVirtualInput?.('brake', false)}
            className="w-14 h-16 rounded-xl bg-red-950/80 border border-red-700 active:bg-red-600 text-red-200 font-extrabold text-xs uppercase flex flex-col items-center justify-center shadow-lg cursor-pointer"
          >
            Brake
          </button>
          <button
            onTouchStart={() => onVirtualInput?.('ers', true)}
            onTouchEnd={() => onVirtualInput?.('ers', false)}
            onMouseDown={() => onVirtualInput?.('ers', true)}
            onMouseUp={() => onVirtualInput?.('ers', false)}
            className="w-14 h-16 rounded-xl bg-cyan-950/80 border border-cyan-600 active:bg-cyan-500 text-cyan-200 font-extrabold text-xs uppercase flex flex-col items-center justify-center shadow-lg cursor-pointer"
          >
            ERS
          </button>
          <button
            onTouchStart={() => onVirtualInput?.('gas', true)}
            onTouchEnd={() => onVirtualInput?.('gas', false)}
            onMouseDown={() => onVirtualInput?.('gas', true)}
            onMouseUp={() => onVirtualInput?.('gas', false)}
            className="w-16 h-16 rounded-xl bg-emerald-950/80 border border-emerald-600 active:bg-emerald-500 text-emerald-200 font-extrabold text-sm uppercase flex flex-col items-center justify-center shadow-lg cursor-pointer"
          >
            Gas
          </button>
        </div>
      </div>
    </div>
  );
};
