import { soundEngine } from '../audio/soundSystem';
import { CAR_LIVERIES } from './carLiveries';
import { CIRCUITS } from './tracks';
import {
  CarLivery,
  CircuitDefinition,
  GameSettings,
  GhostFrame,
  SectorStatus,
  SectorTimes,
  TelemetryData,
  TrackPoint
} from '../types/game';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'smoke' | 'spark' | 'fire' | 'debris';
  rotation?: number;
  rotSpeed?: number;
}

interface SkidMarkPoint {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Offscreen canvas for precise pixel collision mask
  private maskCanvas: HTMLCanvasElement;
  private maskCtx: CanvasRenderingContext2D;

  // Offscreen canvas for persistent skid marks
  private skidCanvas: HTMLCanvasElement;
  private skidCtx: CanvasRenderingContext2D;

  // Circuit and Car selection
  public track: CircuitDefinition;
  public livery: CarLivery;
  public settings: GameSettings;

  // Physics State
  public car = {
    x: 0,
    y: 0,
    angle: 0,
    speed: 0,
    angularVelocity: 0,
    slipRatio: 0,
    width: 22,
    length: 46,
    maxSpeed: 9.6, // ~345 km/h
    acceleration: 0.058,
    brakeForce: 0.16,
    drag: 0.984,
    turnSpeed: 0.046,
    isExploding: false,
    explosionTimer: 0,
    onKerb: false,
    inGravel: false,
    ersBattery: 100, // 0 - 100
    ersActive: false,
    drsActive: false,
    drsEligible: false,
    brakeGlow: 0 // 0 - 1
  };

  // Particles & Visual FX
  private particles: Particle[] = [];
  private skidMarks: SkidMarkPoint[] = [];
  private screenShake = 0;
  private hitstopTimer = 0; // brief 60ms freeze on high-speed crash

  // Camera
  private camera = {
    x: 0,
    y: 0,
    zoom: 1.0,
    targetZoom: 1.0
  };

  // Inputs
  private keys = {
    gas: false,
    brake: false,
    left: false,
    right: false,
    ers: false,
    drs: false
  };

  // Checkpoints & Timing
  private checkpoints: { x: number; y: number; radius: number }[] = [];
  private nextCheckpointIdx = 0;
  private lapStartTime = 0;
  private lapNumber = 1;
  private lastLapTime: number | null = null;
  public bestLapTime: number | null = null;
  public bestSectors: SectorTimes = { s1: null, s2: null, s3: null };
  private sessionFastestSectors: SectorTimes = { s1: null, s2: null, s3: null };
  private currentSectors: SectorTimes = { s1: null, s2: null, s3: null };
  private sectorStatuses: { s1: SectorStatus; s2: SectorStatus; s3: SectorStatus } = {
    s1: 'pending',
    s2: 'pending',
    s3: 'pending'
  };
  private s1SplitTime = 0;
  private s2SplitTime = 0;
  private topSpeedRecorded = 0;

  // Ghost Car
  private currentLapGhostData: GhostFrame[] = [];
  public bestLapGhostData: GhostFrame[] = [];

  // Loop control
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private isRunning = false;
  private isPaused = false;
  public isDemoMode = false;

  // Callbacks to UI
  public onTelemetryUpdate?: (data: TelemetryData) => void;
  public onLapComplete?: (time: number, isBest: boolean, sectors: SectorTimes) => void;

  constructor(canvas: HTMLCanvasElement, trackId = 'monza', liveryId = 'scuderia_scarlet') {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    // Mask Canvas
    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = canvas.width;
    this.maskCanvas.height = canvas.height;
    const mCtx = this.maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!mCtx) throw new Error('Could not get mask context');
    this.maskCtx = mCtx;

    // Skid Canvas
    this.skidCanvas = document.createElement('canvas');
    this.skidCanvas.width = canvas.width;
    this.skidCanvas.height = canvas.height;
    const sCtx = this.skidCanvas.getContext('2d');
    if (!sCtx) throw new Error('Could not get skid context');
    this.skidCtx = sCtx;

    this.track = CIRCUITS.find((c) => c.id === trackId) || CIRCUITS[0];
    this.livery = CAR_LIVERIES.find((l) => l.id === liveryId) || CAR_LIVERIES[0];

    this.settings = {
      soundEnabled: false,
      volume: 0.5,
      cameraMode: 'chase',
      crashMode: 'simcade'
    };

    this.updateWorldCanvasSizes();
    this.loadTrackRecords();
    this.setupListeners();
    this.prepareTrackMask();
    this.setupCheckpoints();
    this.resetCar();
  }

  private updateWorldCanvasSizes() {
    const xs = this.track.points.map((p) => p.x);
    const ys = this.track.points.map((p) => p.y);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const margin = 450;
    const worldW = Math.max(this.canvas.width, Math.ceil(maxX + margin));
    const worldH = Math.max(this.canvas.height, Math.ceil(maxY + margin));

    this.maskCanvas.width = worldW;
    this.maskCanvas.height = worldH;
    this.skidCanvas.width = worldW;
    this.skidCanvas.height = worldH;
  }

  private loadTrackRecords() {
    try {
      const saved = localStorage.getItem(`apex_grid_${this.track.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.bestLapTime = parsed.bestLapTime || null;
        this.bestSectors = parsed.bestSectors || { s1: null, s2: null, s3: null };
        this.sessionFastestSectors = { ...this.bestSectors };
        this.bestLapGhostData = parsed.ghost || [];
      } else {
        this.bestLapTime = null;
        this.bestSectors = { s1: null, s2: null, s3: null };
        this.sessionFastestSectors = { s1: null, s2: null, s3: null };
        this.bestLapGhostData = [];
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveTrackRecords() {
    try {
      const data = {
        bestLapTime: this.bestLapTime,
        bestSectors: this.bestSectors,
        ghost: this.bestLapGhostData
      };
      localStorage.setItem(`apex_grid_${this.track.id}`, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }

  public setTrack(trackId: string) {
    const found = CIRCUITS.find((c) => c.id === trackId);
    if (!found) return;
    this.track = found;
    this.updateWorldCanvasSizes();
    this.loadTrackRecords();
    this.prepareTrackMask();
    this.setupCheckpoints();
    this.clearSkidMarks();
    this.resetCar();
  }

  public setLivery(liveryId: string) {
    const found = CAR_LIVERIES.find((l) => l.id === liveryId);
    if (found) {
      this.livery = found;
    }
  }

  public setDemoMode(demo: boolean) {
    this.isDemoMode = demo;
    if (demo) {
      this.resetCar();
    }
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (paused) {
      soundEngine.stopAll();
    }
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  public clearSkidMarks() {
    this.skidMarks = [];
    this.skidCtx.clearRect(0, 0, this.skidCanvas.width, this.skidCanvas.height);
  }

  private prepareTrackMask() {
    this.maskCtx.fillStyle = '#000000';
    this.maskCtx.fillRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);

    // Track path with road width + kerb margin (White = asphalt & kerbs)
    this.maskCtx.strokeStyle = '#FFFFFF';
    this.maskCtx.lineWidth = this.track.roadWidth + 14;
    this.maskCtx.lineCap = 'round';
    this.maskCtx.lineJoin = 'round';

    this.maskCtx.beginPath();
    this.track.points.forEach((pt, idx) => {
      if (idx === 0) this.maskCtx.moveTo(pt.x, pt.y);
      else this.maskCtx.lineTo(pt.x, pt.y);
    });
    this.maskCtx.closePath();
    this.maskCtx.stroke();
  }

  private setupCheckpoints() {
    this.checkpoints = [];
    const pts = this.track.points;
    for (let i = 0; i < pts.length; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % pts.length];
      this.checkpoints.push({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
        radius: this.track.roadWidth * 0.95
      });
    }
    this.nextCheckpointIdx = 0;
  }

  public resetCar() {
    this.car.x = this.track.start.x;
    this.car.y = this.track.start.y;
    this.car.angle = this.track.start.angle;
    this.car.speed = 0;
    this.car.angularVelocity = 0;
    this.car.slipRatio = 0;
    this.car.isExploding = false;
    this.car.explosionTimer = 0;
    this.car.onKerb = false;
    this.car.inGravel = false;
    this.car.ersBattery = 100;
    this.car.ersActive = false;
    this.car.drsActive = false;
    this.car.drsEligible = false;
    this.car.brakeGlow = 0;

    this.camera.x = this.car.x;
    this.camera.y = this.car.y;
    this.nextCheckpointIdx = 0;
    this.lapStartTime = performance.now();
    this.currentLapGhostData = [];
    this.currentSectors = { s1: null, s2: null, s3: null };
    this.sectorStatuses = { s1: 'pending', s2: 'pending', s3: 'pending' };
    this.topSpeedRecorded = 0;
  }

  private setupListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
  }

  public destroy() {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') this.keys.gas = true;
    if (k === 's' || k === 'arrowdown') this.keys.brake = true;
    if (k === 'a' || k === 'arrowleft') this.keys.left = true;
    if (k === 'd' || k === 'arrowright') this.keys.right = true;
    if (k === ' ' || k === 'shift') this.keys.ers = true;

    if (k === 'e') {
      this.toggleDRS();
    }
    if (k === 'r') {
      this.resetCar();
    }
    if (k === 'c') {
      this.settings.cameraMode = this.settings.cameraMode === 'chase' ? 'overview' : 'chase';
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === 'w' || k === 'arrowup') this.keys.gas = false;
    if (k === 's' || k === 'arrowdown') this.keys.brake = false;
    if (k === 'a' || k === 'arrowleft') this.keys.left = false;
    if (k === 'd' || k === 'arrowright') this.keys.right = false;
    if (k === ' ' || k === 'shift') this.keys.ers = false;
  };

  private handleBlur = () => {
    this.keys.gas = false;
    this.keys.brake = false;
    this.keys.left = false;
    this.keys.right = false;
    this.keys.ers = false;
  };

  // Virtual inputs for touch devices
  public setVirtualInput(control: 'gas' | 'brake' | 'left' | 'right' | 'ers', state: boolean) {
    this.keys[control] = state;
  }

  public toggleDRS() {
    if (this.car.drsEligible && !this.car.drsActive) {
      this.car.drsActive = true;
      soundEngine.playDrsChime();
    } else if (this.car.drsActive) {
      this.car.drsActive = false;
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    soundEngine.stopAll();
  }

  private loop = (currentTime: number) => {
    if (!this.isRunning) return;

    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    const dt = Math.min(rawDt, 0.05); // clamped simulation delta

    if (!this.isPaused) {
      this.update(dt);
    }
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
    }

    // Hitstop freeze effect
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // Explosion state
    if (this.car.isExploding) {
      this.car.explosionTimer -= dt;
      this.updateParticles(dt);
      if (this.car.explosionTimer <= 0) {
        this.resetCar();
      }
      soundEngine.updateTelemetry(0, 0, 0, 0, 0, false, false);
      this.broadcastTelemetry();
      return;
    }

    // AI Demonstration Hotlap Mode (When in Title Screen)
    if (this.isDemoMode) {
      this.updateDemoAI(dt);
    } else {
      this.updatePlayerPhysics(dt);
      this.updateLapAndCheckpoints();
    }

    this.updateParticles(dt);
    this.updateCamera(dt);
    this.broadcastTelemetry();
  }

  private updateDemoAI(_dt: number) {
    // Autonomous racing on title screen
    const targetCp = this.checkpoints[this.nextCheckpointIdx];
    if (targetCp) {
      const dx = targetCp.x - this.car.x;
      const dy = targetCp.y - this.car.y;
      const targetAngle = Math.atan2(dy, dx);
      let angleDiff = targetAngle - this.car.angle;

      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      this.car.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 0.055);

      // Speed guide from track definition or default
      const currentPt = this.track.points[this.nextCheckpointIdx];
      const targetSpeed = currentPt?.speedGuide
        ? (currentPt.speedGuide / 36) * 0.95
        : this.car.maxSpeed * 0.78;

      if (this.car.speed < targetSpeed) {
        this.car.speed += this.car.acceleration;
      } else if (this.car.speed > targetSpeed + 0.4) {
        this.car.speed -= this.car.brakeForce * 0.45;
      }

      this.car.x += Math.cos(this.car.angle) * this.car.speed;
      this.car.y += Math.sin(this.car.angle) * this.car.speed;

      const dist = Math.hypot(dx, dy);
      if (dist < targetCp.radius * 0.85) {
        this.nextCheckpointIdx = (this.nextCheckpointIdx + 1) % this.checkpoints.length;
      }
    }
  }

  private updatePlayerPhysics(dt: number) {
    const isGas = this.keys.gas;
    const isBrake = this.keys.brake;
    const isLeft = this.keys.left;
    const isRight = this.keys.right;

    // Check DRS Zone Eligibility
    this.checkDRSEligibility();

    // ERS Battery Drain / Recharge
    let ersMultiplier = 1.0;
    if (this.keys.ers && this.car.ersBattery > 0 && isGas) {
      this.car.ersActive = true;
      this.car.ersBattery = Math.max(0, this.car.ersBattery - 12 * dt);
      ersMultiplier = 1.35; // +35% punch
    } else {
      this.car.ersActive = false;
      if (isBrake && this.car.speed > 2.0) {
        // Regeneration under heavy braking
        this.car.ersBattery = Math.min(100, this.car.ersBattery + 9 * dt);
      }
    }

    // Top Speed adjustment (DRS reduces drag)
    const effectiveMaxSpeed = this.car.maxSpeed * (this.car.drsActive ? 1.08 : 1.0) * (this.car.ersActive ? 1.04 : 1.0);

    // Gravel slowdown
    const surfaceDrag = this.car.inGravel ? 0.92 : this.car.drag;
    const effectiveAcc = (this.car.inGravel ? this.car.acceleration * 0.35 : this.car.acceleration) * ersMultiplier;

    // Acceleration & Braking
    if (isGas) {
      if (this.car.speed < effectiveMaxSpeed) {
        this.car.speed += effectiveAcc;
      }
    } else if (isBrake) {
      // Brake disc glow & trail braking
      this.car.brakeGlow = Math.min(1.0, this.car.brakeGlow + 4 * dt);
      if (this.car.speed > 0) {
        this.car.speed -= this.car.brakeForce;
        if (this.car.speed < 0) this.car.speed = 0;
      } else if (this.car.speed > -this.car.maxSpeed * 0.25) {
        this.car.speed -= effectiveAcc * 0.5;
      }
    } else {
      this.car.brakeGlow = Math.max(0, this.car.brakeGlow - 2 * dt);
      this.car.speed *= surfaceDrag;
      if (Math.abs(this.car.speed) < 0.02) this.car.speed = 0;
    }

    // Dynamic Steering & Lateral Slip
    if (Math.abs(this.car.speed) > 0.05) {
      const speedRatio = Math.abs(this.car.speed) / this.car.maxSpeed;
      // High-speed downforce creates stability (slight understeer at 330 km/h)
      const aeroStability = 1.0 - speedRatio * 0.28;
      const steerDir = this.car.speed < 0 ? -1 : 1;

      let steerInput = 0;
      if (isLeft) steerInput -= 1;
      if (isRight) steerInput += 1;

      // Trail braking oversteer kick
      const oversteerBonus = isBrake && speedRatio > 0.4 ? 1.25 : 1.0;
      this.car.angle += steerInput * this.car.turnSpeed * aeroStability * oversteerBonus * steerDir;

      // Calculate Lateral Slip Angle
      if (steerInput !== 0 && speedRatio > 0.5) {
        this.car.slipRatio = Math.min(1.0, this.car.slipRatio + 0.12);
      } else {
        this.car.slipRatio = Math.max(0, this.car.slipRatio - 0.08);
      }
    } else {
      this.car.slipRatio = 0;
    }

    // Move Car
    this.car.x += Math.cos(this.car.angle) * this.car.speed;
    this.car.y += Math.sin(this.car.angle) * this.car.speed;

    // Check Boundary & Kerbs
    this.checkTrackBoundary();

    // Spawn Particles & Skid Marks
    this.handleVFX();

    // Audio Engine Telemetry
    const speedKmh = Math.round(Math.abs(this.car.speed) * 36);
    if (speedKmh > this.topSpeedRecorded) {
      this.topSpeedRecorded = speedKmh;
    }

    const currentGear = this.calculateGear(speedKmh);
    const currentRpm = this.calculateRPM(speedKmh, currentGear);

    soundEngine.updateTelemetry(
      currentRpm,
      isGas ? 1 : 0,
      isBrake ? 1 : 0,
      Math.abs(this.car.speed) / this.car.maxSpeed,
      this.car.slipRatio,
      this.car.onKerb,
      this.car.ersActive
    );
  }

  private checkDRSEligibility() {
    const drs = this.track.drsZone;
    if (!drs) {
      this.car.drsEligible = false;
      this.car.drsActive = false;
      return;
    }

    const totalPts = this.track.points.length;
    const currentIdx = this.nextCheckpointIdx;

    let inZone = false;
    if (drs.startIdx <= drs.endIdx) {
      inZone = currentIdx >= drs.startIdx && currentIdx <= drs.endIdx;
    } else {
      // Wraps around start/finish
      inZone = currentIdx >= drs.startIdx || currentIdx <= drs.endIdx;
    }

    this.car.drsEligible = inZone;
    if (!inZone) {
      this.car.drsActive = false;
    }
  }

  private checkTrackBoundary() {
    const cos = Math.cos(this.car.angle);
    const sin = Math.sin(this.car.angle);
    const halfW = this.car.width / 2;
    const halfL = this.car.length / 2;

    const samplePoints = [
      { x: this.car.x + cos * halfL - sin * halfW, y: this.car.y + sin * halfL + cos * halfW }, // Front Left
      { x: this.car.x + cos * halfL + sin * halfW, y: this.car.y + sin * halfL - cos * halfW }, // Front Right
      { x: this.car.x - cos * halfL - sin * halfW, y: this.car.y - sin * halfL + cos * halfW }, // Rear Left
      { x: this.car.x - cos * halfL + sin * halfW, y: this.car.y - sin * halfL - cos * halfW }, // Rear Right
      { x: this.car.x + cos * halfL, y: this.car.y + sin * halfL },                              // Nose
      { x: this.car.x - cos * halfL, y: this.car.y - sin * halfL }                               // Diffuser
    ];

    let offTrackNodes = 0;
    for (const pt of samplePoints) {
      if (pt.x < 0 || pt.x >= this.maskCanvas.width || pt.y < 0 || pt.y >= this.maskCanvas.height) {
        offTrackNodes++;
        continue;
      }
      const pixel = this.maskCtx.getImageData(Math.floor(pt.x), Math.floor(pt.y), 1, 1).data;
      if (pixel[0] < 50) {
        offTrackNodes++;
      }
    }

    const offRatio = offTrackNodes / samplePoints.length;
    this.car.inGravel = offRatio > 0.3;

    // Check Kerb Proximity
    this.car.onKerb = this.checkKerbContact(samplePoints);

    // Boundary rule depends on the selected crash mode (see CrashMode in types/game.ts)
    const mode = this.settings.crashMode;
    if (mode === 'sudden_death' && offTrackNodes > 0) {
      // Any wheel, nose or diffuser beyond the kerb edge: instant explosion at any speed
      this.triggerExplosion();
    } else if (mode === 'hardcore' && offRatio >= 0.5) {
      this.triggerExplosion();
    } else if (mode === 'simcade' && offRatio >= 0.8 && this.car.speed > 5.0) {
      // High speed severe barrier crash
      this.triggerExplosion();
    }
  }

  private checkKerbContact(wheels: { x: number; y: number }[]): boolean {
    const pts = this.track.points;
    for (const wheel of wheels) {
      for (let i = 0; i < pts.length; i++) {
        const pt = pts[i];
        if (pt.kerbSide) {
          const d = Math.hypot(wheel.x - pt.x, wheel.y - pt.y);
          if (d < this.track.roadWidth * 0.58 && d > this.track.roadWidth * 0.4) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private triggerExplosion() {
    this.car.isExploding = true;
    this.car.explosionTimer = 1.0;
    this.car.speed = 0;
    this.hitstopTimer = 0.06; // 60ms simulation hitstop
    this.screenShake = 22;
    soundEngine.playCrashImpact();

    // Debris & Fireburst Particles
    this.particles = [];
    for (let i = 0; i < 75; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 8.5;
      const isDebris = Math.random() > 0.6;

      this.particles.push({
        x: this.car.x,
        y: this.car.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        size: isDebris ? 4 + Math.random() * 6 : 3 + Math.random() * 5,
        color: isDebris
          ? this.livery.chassisColor
          : ['#FF2200', '#FF8800', '#FFDD00', '#FFFFFF', '#333333'][Math.floor(Math.random() * 5)],
        type: isDebris ? 'debris' : 'fire',
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }
  }

  private handleVFX() {
    const cos = Math.cos(this.car.angle);
    const sin = Math.sin(this.car.angle);
    const halfW = this.car.width / 2;
    const halfL = this.car.length / 2;

    const rearLeft = { x: this.car.x - cos * halfL - sin * halfW, y: this.car.y - sin * halfL + cos * halfW };
    const rearRight = { x: this.car.x - cos * halfL + sin * halfW, y: this.car.y - sin * halfL - cos * halfW };

    // Skid marks on heavy slip or brake lockup
    if (this.car.slipRatio > 0.35 || (this.keys.brake && this.car.speed > 3.0)) {
      this.skidMarks.push({
        x1: rearLeft.x,
        y1: rearLeft.y,
        x2: rearRight.x,
        y2: rearRight.y,
        alpha: Math.min(this.car.slipRatio * 0.7, 0.6)
      });
      // Cap skid marks array
      if (this.skidMarks.length > 350) {
        this.skidMarks.shift();
      }

      // Tire smoke
      if (Math.random() > 0.4) {
        this.particles.push({
          x: rearLeft.x + (Math.random() - 0.5) * 6,
          y: rearLeft.y + (Math.random() - 0.5) * 6,
          vx: -cos * 0.8 + (Math.random() - 0.5) * 0.6,
          vy: -sin * 0.8 + (Math.random() - 0.5) * 0.6,
          life: 0.6,
          maxLife: 0.6,
          size: 4 + Math.random() * 6,
          color: '#E2E8F0',
          type: 'smoke'
        });
        this.particles.push({
          x: rearRight.x + (Math.random() - 0.5) * 6,
          y: rearRight.y + (Math.random() - 0.5) * 6,
          vx: -cos * 0.8 + (Math.random() - 0.5) * 0.6,
          vy: -sin * 0.8 + (Math.random() - 0.5) * 0.6,
          life: 0.6,
          maxLife: 0.6,
          size: 4 + Math.random() * 6,
          color: '#E2E8F0',
          type: 'smoke'
        });
      }
    }

    // Sparks from undertray on kerb or bottoming out at high speeds
    if (this.car.onKerb && this.car.speed > 4.5 && Math.random() > 0.3) {
      for (let i = 0; i < 3; i++) {
        const sparkAngle = this.car.angle + Math.PI + (Math.random() - 0.5) * 0.8;
        const sparkSpeed = 2 + Math.random() * 4;
        this.particles.push({
          x: this.car.x - cos * 15,
          y: this.car.y - sin * 15,
          vx: Math.cos(sparkAngle) * sparkSpeed,
          vy: Math.sin(sparkAngle) * sparkSpeed,
          life: 0.25,
          maxLife: 0.25,
          size: 1.5 + Math.random() * 1.5,
          color: '#FFEA80',
          type: 'spark'
        });
      }
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= dt;

      if (p.type === 'debris' && p.rotation !== undefined && p.rotSpeed !== undefined) {
        p.rotation += p.rotSpeed * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
      } else if (p.type === 'smoke') {
        p.size += dt * 8;
        p.vx *= 0.94;
        p.vy *= 0.94;
      }

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private updateCamera(_dt: number) {
    if (this.settings.cameraMode === 'chase') {
      // Dynamic chase camera smoothing
      const targetX = this.car.x + Math.cos(this.car.angle) * (this.car.speed * 8);
      const targetY = this.car.y + Math.sin(this.car.angle) * (this.car.speed * 8);
      this.camera.x += (targetX - this.camera.x) * 0.08;
      this.camera.y += (targetY - this.camera.y) * 0.08;

      // Dynamic zoom based on speed
      const speedRatio = Math.abs(this.car.speed) / this.car.maxSpeed;
      this.camera.targetZoom = 1.25 - speedRatio * 0.28;
      this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.05;
    } else {
      // Full Track Overview: dynamically fit the full track bounds
      const xs = this.track.points.map((p) => p.x);
      const ys = this.track.points.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      const targetCenterX = (minX + maxX) / 2;
      const targetCenterY = (minY + maxY) / 2;
      this.camera.x += (targetCenterX - this.camera.x) * 0.1;
      this.camera.y += (targetCenterY - this.camera.y) * 0.1;

      const trackW = maxX - minX + 320;
      const trackH = maxY - minY + 320;
      const scaleX = this.canvas.width / trackW;
      const scaleY = this.canvas.height / trackH;
      const targetOverviewZoom = Math.min(scaleX, scaleY);
      this.camera.zoom += (targetOverviewZoom - this.camera.zoom) * 0.1;
    }
  }

  private updateLapAndCheckpoints() {
    if (this.isDemoMode) return;

    const now = performance.now();
    const elapsedLapSec = (now - this.lapStartTime) / 1000;

    // Record ghost frame at ~20Hz
    if (!this.car.isExploding && Math.abs(this.car.speed) > 0.1) {
      if (
        this.currentLapGhostData.length === 0 ||
        elapsedLapSec - this.currentLapGhostData[this.currentLapGhostData.length - 1].t > 0.05
      ) {
        this.currentLapGhostData.push({
          t: elapsedLapSec,
          x: this.car.x,
          y: this.car.y,
          angle: this.car.angle,
          speed: this.car.speed
        });
      }
    }

    if (this.checkpoints.length === 0) return;

    const targetCp = this.checkpoints[this.nextCheckpointIdx];
    const dist = Math.hypot(this.car.x - targetCp.x, this.car.y - targetCp.y);

    if (dist < targetCp.radius) {
      // Check Sector 1 completion
      if (this.nextCheckpointIdx === this.track.sectors.s1EndIdx && this.currentSectors.s1 === null) {
        this.currentSectors.s1 = elapsedLapSec;
        this.s1SplitTime = elapsedLapSec;
        const isPurple =
          this.sessionFastestSectors.s1 === null || elapsedLapSec < this.sessionFastestSectors.s1;
        const isGreen =
          this.bestSectors.s1 === null || elapsedLapSec < this.bestSectors.s1;

        this.sectorStatuses.s1 = isPurple ? 'purple' : isGreen ? 'green' : 'yellow';
        if (isPurple) this.sessionFastestSectors.s1 = elapsedLapSec;
        soundEngine.playSectorChime(isPurple);
      }

      // Check Sector 2 completion
      if (this.nextCheckpointIdx === this.track.sectors.s2EndIdx && this.currentSectors.s2 === null) {
        const s2Time = elapsedLapSec - this.s1SplitTime;
        this.currentSectors.s2 = s2Time;
        this.s2SplitTime = elapsedLapSec;
        const isPurple =
          this.sessionFastestSectors.s2 === null || s2Time < this.sessionFastestSectors.s2;
        const isGreen = this.bestSectors.s2 === null || s2Time < this.bestSectors.s2;

        this.sectorStatuses.s2 = isPurple ? 'purple' : isGreen ? 'green' : 'yellow';
        if (isPurple) this.sessionFastestSectors.s2 = s2Time;
        soundEngine.playSectorChime(isPurple);
      }

      this.nextCheckpointIdx++;

      // Complete Lap!
      if (this.nextCheckpointIdx >= this.checkpoints.length) {
        const lapTime = elapsedLapSec;
        const s3Time = lapTime - this.s2SplitTime;
        this.currentSectors.s3 = s3Time;

        const isPurpleS3 =
          this.sessionFastestSectors.s3 === null || s3Time < this.sessionFastestSectors.s3;
        const isGreenS3 = this.bestSectors.s3 === null || s3Time < this.bestSectors.s3;
        this.sectorStatuses.s3 = isPurpleS3 ? 'purple' : isGreenS3 ? 'green' : 'yellow';

        this.lastLapTime = lapTime;
        const isNewBest = !this.bestLapTime || lapTime < this.bestLapTime;

        if (isNewBest) {
          this.bestLapTime = lapTime;
          this.bestSectors = { ...this.currentSectors };
          this.bestLapGhostData = [...this.currentLapGhostData];
          this.saveTrackRecords();
          soundEngine.playLapRecord();
        }

        if (this.onLapComplete) {
          this.onLapComplete(lapTime, isNewBest, { ...this.currentSectors });
        }

        // Reset for next lap
        this.lapNumber++;
        this.lapStartTime = performance.now();
        this.nextCheckpointIdx = 0;
        this.currentLapGhostData = [];
        this.currentSectors = { s1: null, s2: null, s3: null };
        this.sectorStatuses = { s1: 'pending', s2: 'pending', s3: 'pending' };
      }
    }
  }

  private calculateDeltaToBest(elapsed: number): number | null {
    if (!this.bestLapTime || this.bestLapGhostData.length === 0) return null;

    // Find ghost position closest to current track percentage
    const progress = this.nextCheckpointIdx / this.checkpoints.length;
    const ghostTargetIdx = Math.floor(progress * this.bestLapGhostData.length);
    const ghostFrame = this.bestLapGhostData[ghostTargetIdx];

    if (!ghostFrame) return null;
    return elapsed - ghostFrame.t;
  }

  private calculateGear(speedKmh: number): number {
    if (speedKmh <= 0) return 1;
    if (speedKmh < 65) return 1;
    if (speedKmh < 110) return 2;
    if (speedKmh < 160) return 3;
    if (speedKmh < 210) return 4;
    if (speedKmh < 260) return 5;
    if (speedKmh < 305) return 6;
    if (speedKmh < 335) return 7;
    return 8;
  }

  private calculateRPM(speedKmh: number, gear: number): number {
    const gearRatios = [0, 65, 110, 160, 210, 260, 305, 335, 370];
    const prevCap = gearRatios[gear - 1];
    const nextCap = gearRatios[gear];
    const range = nextCap - prevCap;
    const offset = Math.max(0, speedKmh - prevCap);
    const ratio = Math.min(1.0, offset / range);

    return 6500 + ratio * 8200;
  }

  private broadcastTelemetry() {
    if (!this.onTelemetryUpdate) return;
    const speedKmh = Math.round(Math.abs(this.car.speed) * 36);
    const gear = this.calculateGear(speedKmh);
    const rpm = this.calculateRPM(speedKmh, gear);
    const now = performance.now();
    const elapsedLapSec = (now - this.lapStartTime) / 1000;
    const delta = this.calculateDeltaToBest(elapsedLapSec);

    let currentSector: 1 | 2 | 3 = 1;
    if (this.nextCheckpointIdx > this.track.sectors.s2EndIdx) {
      currentSector = 3;
    } else if (this.nextCheckpointIdx > this.track.sectors.s1EndIdx) {
      currentSector = 2;
    }

    this.onTelemetryUpdate({
      speedKmh,
      rpm,
      gear,
      throttle: this.keys.gas ? 1 : 0,
      brake: this.keys.brake ? 1 : 0,
      ersBattery: Math.round(this.car.ersBattery),
      drsAvailable: this.car.drsEligible,
      drsActive: this.car.drsActive,
      currentLapTime: elapsedLapSec,
      lastLapTime: this.lastLapTime,
      bestLapTime: this.bestLapTime,
      currentSector,
      sectors: { ...this.currentSectors },
      sectorStatuses: { ...this.sectorStatuses },
      deltaToBest: delta,
      isOffTrack: this.car.inGravel,
      isExploding: this.car.isExploding,
      lapNumber: this.lapNumber,
      topSpeedKmh: this.topSpeedRecorded,
      gForceLat: this.car.slipRatio * 4.2,
      playerPos: { x: this.car.x, y: this.car.y },
      ghostPos: this.getInterpolatedGhostPos(elapsedLapSec)
    });
  }

  private getInterpolatedGhostPos(elapsedLapSec: number): { x: number; y: number } | null {
    if (!this.bestLapTime || this.bestLapGhostData.length < 2) return null;
    for (let i = 0; i < this.bestLapGhostData.length - 1; i++) {
      if (this.bestLapGhostData[i].t <= elapsedLapSec && this.bestLapGhostData[i + 1].t >= elapsedLapSec) {
        const a = this.bestLapGhostData[i];
        const b = this.bestLapGhostData[i + 1];
        const r = (elapsedLapSec - a.t) / (b.t - a.t);
        return {
          x: a.x + (b.x - a.x) * r,
          y: a.y + (b.y - a.y) * r
        };
      }
    }
    return null;
  }

  // --- RENDERING ---
  public render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Apply Screen Shake
    if (this.screenShake > 0.5) {
      ctx.translate((Math.random() - 0.5) * this.screenShake, (Math.random() - 0.5) * this.screenShake);
    }

    // Apply Camera Transform for both Chase and Overview
    ctx.translate(width / 2, height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Environmental Grass & Run-off Ground
    this.drawEnvironment(ctx, width, height);

    // 2. Track Curbs / Borders
    this.drawCurbs(ctx);

    // 3. Track Asphalt
    this.drawAsphalt(ctx);

    // 4. Skid Marks
    this.drawSkidMarks(ctx);

    // 5. Track Markings (Grid boxes, Start/Finish, DRS Line, Brake Boards)
    this.drawTrackDecorations(ctx);

    // 6. Ghost Car (if recorded)
    this.drawGhostCar(ctx);

    // 7. Player Car or Explosion
    if (!this.car.isExploding) {
      this.drawCar(ctx, this.car.x, this.car.y, this.car.angle, this.livery, false);
    }

    // 8. Particles (Fire, Smoke, Sparks, Carbon Debris)
    this.drawParticles(ctx);

    ctx.restore();
  }

  private drawEnvironment(ctx: CanvasRenderingContext2D, _width: number, _height: number) {
    const xs = this.track.points.map((p) => p.x);
    const ys = this.track.points.map((p) => p.y);
    const minX = Math.min(...xs) - 700;
    const maxX = Math.max(...xs) + 700;
    const minY = Math.min(...ys) - 700;
    const maxY = Math.max(...ys) + 700;

    const w = maxX - minX;
    const h = maxY - minY;

    ctx.fillStyle = '#1e5927';
    ctx.fillRect(minX, minY, w, h);

    // Mowed lawn alternating stripes
    ctx.strokeStyle = 'rgba(40, 115, 52, 0.45)';
    ctx.lineWidth = 45;
    for (let x = minX; x < maxX; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
      ctx.stroke();
    }
  }

  private drawCurbs(ctx: CanvasRenderingContext2D) {
    // Outer curb border with alternating red and white strips
    ctx.save();
    ctx.strokeStyle = '#D32F2F';
    ctx.lineWidth = this.track.roadWidth + 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([22, 22]);
    this.drawTrackPath(ctx);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineDashOffset = 22;
    this.drawTrackPath(ctx);
    ctx.restore();
  }

  private drawAsphalt(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // Primary dark racing asphalt
    ctx.strokeStyle = '#2B2D33';
    ctx.lineWidth = this.track.roadWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    this.drawTrackPath(ctx);

    // Rubbered-in racing groove line (darker band in center)
    ctx.strokeStyle = '#222328';
    ctx.lineWidth = this.track.roadWidth * 0.55;
    this.drawTrackPath(ctx);

    // White track edge continuous lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    // Inner track edge
    ctx.stroke();
    ctx.restore();
  }

  private drawTrackPath(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    this.track.points.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.closePath();
    ctx.stroke();
  }

  private drawSkidMarks(ctx: CanvasRenderingContext2D) {
    if (this.skidMarks.length < 2) return;
    ctx.save();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    for (let i = 1; i < this.skidMarks.length; i++) {
      const prev = this.skidMarks[i - 1];
      const curr = this.skidMarks[i];

      ctx.strokeStyle = `rgba(10, 10, 12, ${curr.alpha})`;

      // Left wheel trail
      ctx.beginPath();
      ctx.moveTo(prev.x1, prev.y1);
      ctx.lineTo(curr.x1, curr.y1);
      ctx.stroke();

      // Right wheel trail
      ctx.beginPath();
      ctx.moveTo(prev.x2, prev.y2);
      ctx.lineTo(curr.x2, curr.y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawTrackDecorations(ctx: CanvasRenderingContext2D) {
    // 1. Start / Finish Line
    const p1 = this.track.points[0];
    const p2 = this.track.points[1];
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) + Math.PI / 2;
    const hw = this.track.roadWidth / 2;

    ctx.save();
    ctx.translate(this.track.start.x, this.track.start.y);
    ctx.rotate(angle);

    const checks = 10;
    const barH = 14;
    const cellW = this.track.roadWidth / checks;
    for (let i = 0; i < checks; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#111111';
      ctx.fillRect(-hw + i * cellW, -barH / 2, cellW, barH / 2);
      ctx.fillStyle = i % 2 !== 0 ? '#FFFFFF' : '#111111';
      ctx.fillRect(-hw + i * cellW, 0, cellW, barH / 2);
    }
    ctx.restore();

    // 2. Brake Boards
    this.track.brakeMarkers.forEach((bm) => {
      ctx.save();
      ctx.translate(bm.x, bm.y);
      ctx.rotate(bm.angle);
      // Board sign
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-18, -8, 36, 16);
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-18, -8, 36, 16);
      ctx.fillStyle = '#111111';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bm.distance, 0, 1);
      ctx.restore();
    });

    // 3. DRS Activation Line
    const drs = this.track.drsZone;
    if (drs && this.track.points[drs.startIdx]) {
      const drsPt = this.track.points[drs.startIdx];
      ctx.save();
      ctx.fillStyle = '#00E676';
      ctx.beginPath();
      ctx.arc(drsPt.x, drsPt.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawGhostCar(ctx: CanvasRenderingContext2D) {
    if (!this.bestLapTime || this.bestLapGhostData.length === 0) return;

    const now = performance.now();
    const elapsedLapSec = (now - this.lapStartTime) / 1000;

    // Linear interpolation between recorded ghost timestamps
    let frameA: GhostFrame | null = null;
    let frameB: GhostFrame | null = null;

    for (let i = 0; i < this.bestLapGhostData.length - 1; i++) {
      if (this.bestLapGhostData[i].t <= elapsedLapSec && this.bestLapGhostData[i + 1].t >= elapsedLapSec) {
        frameA = this.bestLapGhostData[i];
        frameB = this.bestLapGhostData[i + 1];
        break;
      }
    }

    if (!frameA || !frameB) return;

    const ratio = (elapsedLapSec - frameA.t) / (frameB.t - frameA.t);
    const gx = frameA.x + (frameB.x - frameA.x) * ratio;
    const gy = frameA.y + (frameB.y - frameA.y) * ratio;
    let ga = frameA.angle;
    // Normalize angle difference for shortest angular lerp
    let diff = frameB.angle - frameA.angle;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    ga += diff * ratio;

    // Draw holographic translucent ghost car
    ctx.save();
    ctx.globalAlpha = 0.38;
    this.drawCar(ctx, gx, gy, ga, this.livery, true);
    ctx.restore();
  }

  /**
   * Procedural Open-Wheel Car Rendering
   * Detailed chassis, sidepods, bargeboards, front & rear wing flaps,
   * halo structure, neon driver helmet, wishbone suspension, and spinning wheels.
   */
  private drawCar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    livery: CarLivery,
    isGhost: boolean
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (isGhost) {
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 10;
    }

    // 1. Glowing Brake Discs under heavy deceleration
    if (this.car.brakeGlow > 0.1 && !isGhost) {
      ctx.fillStyle = `rgba(255, 90, 0, ${this.car.brakeGlow * 0.9})`;
      ctx.shadowColor = '#FF5500';
      ctx.shadowBlur = 8;
      // Front brakes
      ctx.fillRect(10, -14, 11, 4);
      ctx.fillRect(10, 10, 11, 4);
      // Rear brakes
      ctx.fillRect(-17, -15, 12, 4);
      ctx.fillRect(-17, 11, 12, 4);
      ctx.shadowBlur = 0;
    }

    // 2. Open-Wheel Pirelli Tires
    ctx.fillStyle = isGhost ? '#00E5FF' : '#141416';
    // Front tires
    ctx.fillRect(9, -16, 13, 6.5);
    ctx.fillRect(9, 9.5, 13, 6.5);
    // Rear tires (wider stance)
    ctx.fillRect(-18, -17.5, 15, 7.5);
    ctx.fillRect(-18, 10, 15, 7.5);

    // Tire Compounds Stripe (Soft Red / Hard White)
    if (!isGhost) {
      ctx.fillStyle = '#E10600';
      ctx.fillRect(14, -16, 2.5, 6.5);
      ctx.fillRect(14, 9.5, 2.5, 6.5);
      ctx.fillRect(-12, -17.5, 2.5, 7.5);
      ctx.fillRect(-12, 10, 2.5, 7.5);
    }

    // 3. Double-Wishbone Carbon Suspension Arms
    ctx.strokeStyle = isGhost ? 'rgba(0, 229, 255, 0.6)' : '#3F424E';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(15, 0); ctx.lineTo(15, -13);
    ctx.moveTo(15, 0); ctx.lineTo(15, 13);
    ctx.moveTo(-11, 0); ctx.lineTo(-11, -14);
    ctx.moveTo(-11, 0); ctx.lineTo(-11, 14);
    ctx.stroke();

    // 4. Front Aerodynamic Wing & Endplates
    ctx.fillStyle = isGhost ? '#00E5FF' : livery.chassisColor;
    ctx.fillRect(17, -15, 4.5, 30);
    // Endplates
    ctx.fillStyle = isGhost ? '#FFFFFF' : livery.wingColor;
    ctx.fillRect(20, -15.5, 2, 31);

    // 5. Rear Wing & DRS Flap
    ctx.fillStyle = isGhost ? '#00E5FF' : livery.wingColor;
    ctx.fillRect(-22, -15, 5, 30); // Main plane

    if (this.car.drsActive && !isGhost) {
      // DRS Flap opened (raised and tilted)
      ctx.fillStyle = '#00E676'; // DRS Green glowing highlight
      ctx.fillRect(-25, -13, 2.5, 26);
    } else {
      ctx.fillStyle = isGhost ? '#FFFFFF' : livery.chassisColor;
      ctx.fillRect(-21, -13, 3, 26);
    }

    // 6. Main Monocoque Chassis & Sculpted Sidepods
    ctx.fillStyle = isGhost ? '#00C8FF' : livery.chassisColor;
    ctx.beginPath();
    ctx.moveTo(21, 0);               // Nosecone tip
    ctx.lineTo(9, -4.5);
    ctx.lineTo(-2, -9.5);            // Left sidepod flare
    ctx.lineTo(-15, -8);
    ctx.lineTo(-18, 0);              // Rear engine cover sharkfin
    ctx.lineTo(-15, 8);
    ctx.lineTo(-2, 9.5);             // Right sidepod flare
    ctx.lineTo(9, 4.5);
    ctx.closePath();
    ctx.fill();

    // 7. Team Livery Stripe / Accent Branding
    ctx.fillStyle = isGhost ? '#FFFFFF' : livery.accentColor;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(5, -2);
    ctx.lineTo(-11, -2);
    ctx.lineTo(-11, 2);
    ctx.lineTo(5, 2);
    ctx.closePath();
    ctx.fill();

    // 8. Driver Cockpit & Titanium Halo Structure
    ctx.fillStyle = isGhost ? '#000000' : '#14151B';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.8, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Driver Helmet (fluorescent yellow/cyan)
    ctx.fillStyle = isGhost ? '#FFFFFF' : '#FACC15';
    ctx.beginPath();
    ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // Halo bar
    ctx.strokeStyle = isGhost ? '#00F0FF' : '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 4.4, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();

    // 9. Rear FIA Safety Rain Light
    ctx.fillStyle = isGhost ? '#00F0FF' : this.car.ersActive ? '#00E5FF' : '#FF0033';
    ctx.fillRect(-22, -1.5, 2, 3);

    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D) {
    this.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;

      if (p.type === 'debris' && p.rotation !== undefined) {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }
}
