export type GameState = 'TITLE_SCREEN' | 'PLAYING' | 'PAUSED' | 'LAP_SUMMARY';

export interface Point {
  x: number;
  y: number;
}

export interface TrackPoint extends Point {
  width?: number;
  kerbSide?: 'left' | 'right' | 'both';
  speedGuide?: number; // km/h recommendation
}

export interface DRSZone {
  detectIdx: number;
  startIdx: number;
  endIdx: number;
}

export interface BrakeMarker {
  x: number;
  y: number;
  distance: string; // '150m', '100m', '50m'
  angle: number;
}

export interface CircuitDefinition {
  id: string;
  name: string;
  location: string;
  countryCode: string;
  flag: string;
  lengthKm: number;
  roadWidth: number;
  start: {
    x: number;
    y: number;
    angle: number; // in radians
  };
  points: TrackPoint[];
  drsZone: DRSZone;
  sectors: {
    s1EndIdx: number;
    s2EndIdx: number;
  };
  brakeMarkers: BrakeMarker[];
  targetLapTime: number; // in seconds
  difficulty: 'ROOKIE' | 'INTERMEDIATE' | 'PRO' | 'EXTREME' | 'CHAMPION';
  characteristics: string[];
}

export interface CarLivery {
  id: string;
  team: string;
  driver: string;
  number: number;
  chassisColor: string;
  accentColor: string;
  wingColor: string;
  glowColor: string;
}

export interface GhostFrame {
  t: number; // time in seconds from lap start
  x: number;
  y: number;
  angle: number;
  speed: number;
}

export interface SectorTimes {
  s1: number | null;
  s2: number | null;
  s3: number | null;
}

export type SectorStatus = 'pending' | 'green' | 'purple' | 'yellow';

export interface TelemetryData {
  speedKmh: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  ersBattery: number; // 0 to 100
  drsAvailable: boolean;
  drsActive: boolean;
  currentLapTime: number;
  lastLapTime: number | null;
  bestLapTime: number | null;
  currentSector: 1 | 2 | 3;
  sectors: SectorTimes;
  sectorStatuses: {
    s1: SectorStatus;
    s2: SectorStatus;
    s3: SectorStatus;
  };
  deltaToBest: number | null;
  isOffTrack: boolean;
  isExploding: boolean;
  lapNumber: number;
  topSpeedKmh: number;
  gForceLat: number;
  playerPos?: { x: number; y: number };
  ghostPos?: { x: number; y: number } | null;
}

/**
 * How harshly leaving the track is punished:
 * - simcade: gravel slows you down; only a high-speed, almost fully off-track excursion explodes
 * - hardcore: explodes as soon as half the car leaves the track, at any speed
 * - sudden_death: explodes the instant any part of the car crosses the outer edge of the kerbs
 */
export type CrashMode = 'simcade' | 'hardcore' | 'sudden_death';

export interface GameSettings {
  soundEnabled: boolean;
  volume: number;
  cameraMode: 'chase' | 'overview';
  crashMode: CrashMode;
}
