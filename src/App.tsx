import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GameEngine } from './game/gameEngine';
import { GameHUD } from './components/GameHUD';
import { TitleScreen } from './components/TitleScreen';
import { PauseModal } from './components/PauseModal';
import { LapSummaryModal } from './components/LapSummaryModal';
import { soundEngine } from './audio/soundSystem';
import { CIRCUITS } from './game/tracks';
import { CAR_LIVERIES } from './game/carLiveries';
import {
  CarLivery,
  CircuitDefinition,
  CrashMode,
  GameState,
  SectorTimes,
  TelemetryData
} from './types/game';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // High-level App State
  const [gameState, setGameState] = useState<GameState>('TITLE_SCREEN');
  const [selectedTrack, setSelectedTrack] = useState<CircuitDefinition>(CIRCUITS[0]);
  const [selectedLivery, setSelectedLivery] = useState<CarLivery>(CAR_LIVERIES[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [cameraMode, setCameraMode] = useState<'chase' | 'overview'>('chase');
  const [crashMode, setCrashMode] = useState<CrashMode>('simcade');

  // Real-time telemetry throttled state for React HUD
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  // Keep ref of current gameState for callbacks
  const gameStateRef = useRef<GameState>(gameState);
  gameStateRef.current = gameState;

  // Lap summary modal data
  const [completedLapTime, setCompletedLapTime] = useState<number>(0);
  const [isCompletedLapBest, setIsCompletedLapBest] = useState<boolean>(false);
  const [completedSectors, setCompletedSectors] = useState<SectorTimes>({
    s1: null,
    s2: null,
    s3: null
  });

  // Mount canvas and instantiate 60fps simulation engine
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      selectedTrack.id,
      selectedLivery.id
    );
    engineRef.current = engine;

    // Throttle telemetry update to ~25Hz for React UI efficiency
    let lastUiUpdate = 0;
    engine.onTelemetryUpdate = (data: TelemetryData) => {
      const now = performance.now();
      if (now - lastUiUpdate > 40) {
        lastUiUpdate = now;
        setTelemetry(data);
      }
    };

    engine.onLapComplete = (time: number, isBest: boolean, sectors: SectorTimes) => {
      // Guard: strictly ignore if engine is in background demo mode or player not in active PLAYING state
      if (engine.isDemoMode || gameStateRef.current !== 'PLAYING') return;
      setCompletedLapTime(time);
      setIsCompletedLapBest(isBest);
      setCompletedSectors(sectors);
      setGameState('LAP_SUMMARY');
    };

    // Start in demo AI mode for title screen backdrop
    engine.setDemoMode(true);
    engine.start();

    return () => {
      engine.destroy();
    };
  }, []); // Run once on mount

  // Sync engine settings
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.settings.soundEnabled = soundEnabled;
      engineRef.current.settings.volume = volume;
      engineRef.current.settings.cameraMode = cameraMode;
      engineRef.current.settings.crashMode = crashMode;
    }
  }, [soundEnabled, volume, cameraMode, crashMode]);

  // Global ESC key to toggle Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'PLAYING') {
          engineRef.current?.setPaused(true);
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          engineRef.current?.setPaused(false);
          setGameState('PLAYING');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Actions
  const handleStartGame = useCallback(() => {
    soundEngine.init();
    soundEngine.resume();
    setSoundEnabled(true);
    soundEngine.setEnabled(true);

    if (engineRef.current) {
      engineRef.current.setDemoMode(false);
      engineRef.current.setPaused(false);
      engineRef.current.resetCar();
    }
    setGameState('PLAYING');
  }, []);

  const handleSelectTrack = useCallback((track: CircuitDefinition) => {
    setSelectedTrack(track);
    if (engineRef.current) {
      engineRef.current.setTrack(track.id);
    }
  }, []);

  const handleSelectLivery = useCallback((livery: CarLivery) => {
    setSelectedLivery(livery);
    if (engineRef.current) {
      engineRef.current.setLivery(livery.id);
    }
  }, []);

  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
  }, [soundEnabled]);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
    soundEngine.setVolume(vol);
  }, []);

  const handleToggleCamera = useCallback(() => {
    setCameraMode((prev) => (prev === 'chase' ? 'overview' : 'chase'));
  }, []);

  const handleCycleCrashMode = useCallback(() => {
    setCrashMode((prev) => (prev === 'simcade' ? 'hardcore' : prev === 'hardcore' ? 'sudden_death' : 'simcade'));
  }, []);

  const handleRestartLap = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resetCar();
      engineRef.current.setPaused(false);
    }
    if (gameState === 'PAUSED' || gameState === 'LAP_SUMMARY') {
      setGameState('PLAYING');
    }
  }, [gameState]);

  const handleResume = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.setPaused(false);
    }
    setGameState('PLAYING');
  }, []);

  const handleReturnToMenu = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.setDemoMode(true);
      engineRef.current.setPaused(false);
      engineRef.current.resetCar();
    }
    setGameState('TITLE_SCREEN');
  }, []);

  const handleVirtualInput = useCallback(
    (control: 'gas' | 'brake' | 'left' | 'right' | 'ers', state: boolean) => {
      engineRef.current?.setVirtualInput(control, state);
    },
    []
  );

  const handleToggleDRS = useCallback(() => {
    engineRef.current?.toggleDRS();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0d10] flex items-center justify-center">
      <Analytics />
      {/* 60FPS Dedicated Canvas Mount Container */}
      <div className="relative w-full h-full max-w-[1440px] max-h-[900px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={1180}
          height={720}
          className="w-full h-full object-contain shadow-2xl block bg-[#1e5927]"
        />

        {/* State: Title Screen */}
        {gameState === 'TITLE_SCREEN' && (
          <TitleScreen
            selectedTrack={selectedTrack}
            selectedLivery={selectedLivery}
            soundEnabled={soundEnabled}
            crashMode={crashMode}
            onSelectTrack={handleSelectTrack}
            onSelectLivery={handleSelectLivery}
            onToggleSound={handleToggleSound}
            onCycleCrashMode={handleCycleCrashMode}
            onStartGame={handleStartGame}
          />
        )}

        {/* State: Active Playing HUD */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <GameHUD
            telemetry={telemetry}
            track={selectedTrack}
            soundEnabled={soundEnabled}
            cameraMode={cameraMode}
            onToggleSound={handleToggleSound}
            onToggleCamera={handleToggleCamera}
            onRestartLap={handleRestartLap}
            onPause={() => {
              engineRef.current?.setPaused(true);
              setGameState('PAUSED');
            }}
            onVirtualInput={handleVirtualInput}
            onToggleDRS={handleToggleDRS}
          />
        )}

        {/* State: Pause Modal */}
        <PauseModal
          isOpen={gameState === 'PAUSED'}
          track={selectedTrack}
          livery={selectedLivery}
          soundEnabled={soundEnabled}
          cameraMode={cameraMode}
          volume={volume}
          onResume={handleResume}
          onRestartLap={handleRestartLap}
          onSelectTrack={handleSelectTrack}
          onSelectLivery={handleSelectLivery}
          onToggleSound={handleToggleSound}
          onVolumeChange={handleVolumeChange}
          onToggleCamera={handleToggleCamera}
          onReturnToMenu={handleReturnToMenu}
        />

        {/* State: Lap Summary / Record Modal */}
        <LapSummaryModal
          isOpen={gameState === 'LAP_SUMMARY'}
          lapTime={completedLapTime}
          isBest={isCompletedLapBest}
          sectors={completedSectors}
          track={selectedTrack}
          onContinue={handleResume}
          onChangeCircuit={() => {
            setGameState('TITLE_SCREEN');
            engineRef.current?.setDemoMode(true);
          }}
          onReturnToMenu={handleReturnToMenu}
        />
      </div>
    </div>
  );
}
