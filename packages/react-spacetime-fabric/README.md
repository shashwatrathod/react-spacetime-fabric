# react-spacetime-fabric

An interactive React component that renders a physics-based spacetime fabric simulation, visualizing gravitational effects, time dilation, and relativistic phenomena.

![Spacetime Fabric Simulation](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Features

- 🌌 **Real-time Physics Simulation**: Mass-spring-damper system with Verlet integration
- ⚛️ **Relativistic Effects**: Finite signal speed propagation simulating light-speed constraints
- 🎮 **Interactive Controls**: 20+ configurable parameters for customizing physics
- 🎨 **Visual Customization**: Multiple particle shapes, color schemes, and rendering modes
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- 🎯 **TypeScript**: Fully typed API with comprehensive type definitions

## Installation

```bash
npm install react-spacetime-fabric
# or
yarn add react-spacetime-fabric
# or
pnpm add react-spacetime-fabric
```

## Quick Start

```tsx
import { SpacetimeCanvas, SimulationConfig } from 'react-spacetime-fabric';

const config: SimulationConfig = {
  gridSpacing: 35,
  mouseForce: 10,
  mouseInteractionRadius: 280,
  stiffness: 0.2,
  damping: 0.92,
  enableSignalDelay: false,
  signalSpeed: 15,
  renderPoints: true,
  renderLines: true,
  particleShape: 'circle',
  colorScheme: 'neon',
  // ... see Configuration below for all options
};

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <SpacetimeCanvas config={config} />
    </div>
  );
}
```

## Configuration

The `SimulationConfig` interface provides extensive control over the physics simulation and visual appearance:

### Physics Parameters

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `gridSpacing` | `number` | 20-80 | 35 | Distance between grid points (affects performance) |
| `stiffness` | `number` | 0.0-1.0 | 0.2 | Grid connection stiffness (>0.5 may be unstable) |
| `damping` | `number` | 0.0-1.0 | 0.92 | Energy dissipation factor |
| `mouseForce` | `number` | -20 to 40 | 10 | Gravitational force strength (negative = repulsion) |
| `mouseInteractionRadius` | `number` | 100-600 | 280 | Radius of gravitational influence |
| `gravityDivergence` | `number` | 0-2 | 0 | Angular asymmetry in gravitational field |

### Relativistic Effects

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableSignalDelay` | `boolean` | false | Enable finite signal speed (simulates light-speed constraints) |
| `signalSpeed` | `number` | 15 | Speed of gravity propagation (px/frame) |
| `signalRandomness` | `number` | 0 | Spatial variance in signal propagation (0-2) |

### Visual Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `renderPoints` | `boolean` | true | Show grid particles |
| `renderLines` | `boolean` | true | Show grid connections |
| `renderMotionOnly` | `boolean` | false | Only render moving particles |
| `particleShape` | `'circle' \| 'oval' \| 'square' \| 'diamond' \| 'star'` | 'circle' | Particle shape |
| `particleBaseSize` | `number` | 1.2 | Base particle size |
| `particleBaseOpacity` | `number` | 0.4 | Base particle opacity |
| `colorScheme` | `'neon' \| 'matrix' \| 'sunset'` | 'neon' | Predefined color scheme |
| `overrideThemeColor` | `boolean` | false | Use custom color instead of theme |
| `customParticleColor` | `string` | '#ffffff' | Hex color for custom theme |

### Advanced Effects

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pulsing` | `boolean` | false | Enable breathing/pulsing mass effect |
| `pulsingSpeed` | `number` | 1 | Frequency of pulsing (0.1-3) |
| `pulsingDepth` | `number` | 0.35 | Amplitude of pulsing (0.05-0.8) |
| `cursorActivationLatency` | `number` | 0 | Delay before gravity activates (ms) |

## Examples

### Minimal Configuration

```tsx
const minimalConfig: SimulationConfig = {
  gridSpacing: 40,
  mouseForce: 10,
  mouseInteractionRadius: 200,
  stiffness: 0.2,
  damping: 0.92,
  enableSignalDelay: false,
  signalSpeed: 15,
  signalRandomness: 0,
  renderPoints: true,
  renderLines: true,
  renderMotionOnly: false,
  motionSpeedThreshold: 0.5,
  motionDisplacementThreshold: 0.6,
  particleBaseSize: 1.2,
  particleBaseOpacity: 0.4,
  particleSizeVariance: 0,
  particleOpacityVariance: 0,
  particleShape: 'circle',
  colorScheme: 'neon',
  overrideThemeColor: false,
  customParticleColor: '#ffffff',
  gravityDivergence: 0,
  cursorActivationLatency: 0,
  pulsing: false,
  pulsingSpeed: 1,
  pulsingDepth: 0.35,
};
```

### Black Hole Simulation

```tsx
const blackHoleConfig: SimulationConfig = {
  ...minimalConfig,
  mouseForce: 35,
  mouseInteractionRadius: 400,
  enableSignalDelay: true,
  signalSpeed: 12,
  pulsing: true,
  pulsingSpeed: 0.8,
  pulsingDepth: 0.5,
  gravityDivergence: 0.3,
  particleShape: 'star',
  colorScheme: 'sunset',
};
```

### Repulsion Field

```tsx
const repulsionConfig: SimulationConfig = {
  ...minimalConfig,
  mouseForce: -15,
  colorScheme: 'matrix',
  particleShape: 'diamond',
};
```

## Component Props

### SpacetimeCanvas

```tsx
interface SpacetimeCanvasProps {
  config: SimulationConfig;
  className?: string;
}
```

- `config` (required): Full simulation configuration object
- `className` (optional): CSS class for the canvas element. If not provided, inline styles will position the canvas absolutely to fill its container.

## Performance Considerations

- **Grid Spacing**: Lower values (20-30px) create more particles and are significantly more CPU-intensive. Use 35-50px for better performance.
- **Signal Delay**: Enabling `enableSignalDelay` adds ~20% CPU overhead due to historical mouse position tracking.
- **Motion-Only Rendering**: Setting `renderMotionOnly: true` can reduce render time by 50-70% by only drawing moving particles.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (with reduced grid density recommended)

## Physics Background

This simulation approximates spacetime curvature using a discrete mass-spring-damper system. Key physics concepts:

1. **Verlet Integration**: Symplectic numerical integration for stable, energy-conserving simulation
2. **Finite Signal Speed**: Optional propagation delay simulating light-speed constraints
3. **Time-Varying Mass**: Pulsing effects create gravitational wave-like disturbances

For detailed physics documentation, see the [comprehensive documentation](https://github.com/shashwatrathod/react-spacetime-fabric).

## License

MIT © Shashwat Rathod

## Links

- [Documentation Website](https://spacetime-fabric-docs.vercel.app) *(coming soon)*
- [GitHub Repository](https://github.com/shashwatrathod/react-spacetime-fabric)
- [NPM Package](https://www.npmjs.com/package/react-spacetime-fabric)
