
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

/**
 * Configuration options for the Spacetime Simulation
 */
export interface SimulationConfig {
  /** Distance between grid points in pixels */
  gridSpacing: number;
  /** Stiffness of the grid connections (0-1) */
  stiffness: number;
  /** Damping factor for particle motion (0-1) */
  damping: number;
  /** Radius of the mouse/gravity influence in pixels */
  mouseInteractionRadius: number;
  /** Strength of the gravity force. Positive for attraction, negative for repulsion */
  mouseForce: number;
  /** Irregularity of the gravity field radius (0-2) */
  gravityDivergence: number;
  /** Latency in ms before gravity activates after cursor movement */
  cursorActivationLatency: number;
  /** Enable pulsating mass effect */
  pulsing: boolean;
  /** Multiplier for breathing frequency */
  pulsingSpeed: number;
  /** Multiplier for breathing amplitude (0-1) */
  pulsingDepth: number;
  /** If true, gravity propagates at finite speed */
  enableSignalDelay: boolean;
  /** Speed of gravity propagation in pixels per frame */
  signalSpeed: number;
  /** Randomness in signal propagation (0-1+) */
  signalRandomness: number;
  /** Whether to render the particles */
  renderPoints: boolean;
  /** Whether to render the grid lines */
  renderLines: boolean;
  /** Only render particles that are moving */
  renderMotionOnly: boolean;
  /** Minimum speed to be visible in motion-only mode */
  motionSpeedThreshold: number;
  /** Minimum displacement to be visible in motion-only mode */
  motionDisplacementThreshold: number;
  /** Base radius of particles */
  particleBaseSize: number;
  /** Base opacity of particles (0-1) */
  particleBaseOpacity: number;
  /** Random variation in particle size */
  particleSizeVariance: number;
  /** Random variation in particle opacity */
  particleOpacityVariance: number;
  /** Shape of the particles */
  particleShape: 'circle' | 'square' | 'diamond' | 'star' | 'oval';
  /** Use custom color instead of theme */
  overrideThemeColor: boolean;
  /** Hex color for particles if overrideThemeColor is true */
  customParticleColor: string;
  /** Predefined color scheme */
  colorScheme: 'neon' | 'matrix' | 'sunset';
}
