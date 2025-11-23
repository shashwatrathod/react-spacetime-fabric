
export interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
  baseX: number; // Original grid position for "memory"
  baseY: number;
  randomSeed: number; // For texture/noise in propagation
}

export interface Stick {
  p1: Point;
  p2: Point;
  length: number;
  color?: string;
}

export interface GridConfig {
  /** Distance between grid points in pixels */
  spacing: number;
  /** Stiffness of the grid connections (0-1) */
  stiffness: number;
  /** Damping factor for particle motion (0-1) */
  damping: number;
}

export interface GravityConfig {
  /** Strength of the gravity force. Positive for attraction, negative for repulsion */
  strength: number;
  /** Radius of the mouse/gravity influence in pixels */
  radius: number;
  /** Irregularity of the gravity field radius (0-2) */
  divergence: number;
  /** Latency in ms before gravity activates after cursor movement */
  activationLatency: number;
}

export interface SignalConfig {
  /** If true, gravity propagates at finite speed */
  enabled: boolean;
  /** Speed of gravity propagation in pixels per frame */
  speed?: number;
  /** Randomness in signal propagation (0-1+) */
  randomness?: number;
}

export interface PulsingConfig {
  /** Enable pulsating mass effect */
  enabled: boolean;
  /** Multiplier for breathing frequency */
  speed?: number;
  /** Multiplier for breathing amplitude (0-1) */
  depth?: number;
}

export interface MotionRenderConfig {
  /** Only render particles that are moving */
  enabled: boolean;
  /** Minimum speed to be visible in motion-only mode */
  speedThreshold?: number;
  /** Minimum displacement to be visible in motion-only mode */
  displacementThreshold?: number;
}

export interface ParticleAppearanceConfig {
  /** Base radius of particles */
  baseSize: number;
  /** Base opacity of particles (0-1) */
  baseOpacity: number;
  /** Random variation in particle size */
  sizeVariance: number;
  /** Random variation in particle opacity */
  opacityVariance: number;
  /** Shape of the particles */
  shape: 'circle' | 'square' | 'diamond' | 'star' | 'oval';
  /** Custom color for particles. If provided, overrides theme color. */
  color?: string;
}

export interface RenderConfig {
  /** Whether to render the particles */
  points: boolean;
  /** Whether to render the grid lines */
  lines: boolean;
  /** Configuration for motion-only rendering */
  motion?: MotionRenderConfig;
  /** Configuration for particle appearance */
  particles: ParticleAppearanceConfig;
  /** Predefined color scheme */
  colorScheme: 'neon' | 'matrix' | 'sunset';
}

/**
 * Configuration options for the Spacetime Simulation
 */
export interface SimulationConfig {
  grid: GridConfig;
  gravity: GravityConfig;
  signal: SignalConfig;
  pulsing: PulsingConfig;
  render: RenderConfig;
}
