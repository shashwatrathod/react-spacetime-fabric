# react-spacetime-fabric

An interactive React component that renders a physics-based spacetime fabric simulation, visualizing gravitational effects, time dilation, and relativistic phenomena.

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
  grid: {
    spacing: 35,
    stiffness: 0.2,
    damping: 0.92
  },
  gravity: {
    strength: 10,
    radius: 280,
    divergence: 0,
    activationLatency: 0
  },
  render: {
    points: true,
    lines: true,
    particles: {
      baseSize: 1.2,
      baseOpacity: 0.4,
      sizeVariance: 0,
      opacityVariance: 0,
      shape: 'circle'
    },
    colorScheme: 'neon'
  },
  signal: {
    enabled: false
  },
  pulsing: {
    enabled: false
  }
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

The `SimulationConfig` interface provides extensive control over the physics simulation and visual appearance, organized into logical groups:

### Grid Configuration (`grid`)

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `spacing` | `number` | 20-80 | 35 | Distance between grid points (affects performance) |
| `stiffness` | `number` | 0.0-1.0 | 0.2 | Grid connection stiffness (>0.5 may be unstable) |
| `damping` | `number` | 0.0-1.0 | 0.92 | Energy dissipation factor |

### Gravity Configuration (`gravity`)

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `strength` | `number` | -20 to 40 | 10 | Gravitational force strength (negative = repulsion) |
| `radius` | `number` | 100-600 | 280 | Radius of gravitational influence |
| `divergence` | `number` | 0-2 | 0 | Angular asymmetry in gravitational field |
| `activationLatency` | `number` | 0-2000 | 0 | Delay before gravity activates (ms) |

### Signal Propagation (`signal`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | false | Enable finite signal speed (simulates light-speed constraints) |
| `speed` | `number` | 15 | Speed of gravity propagation (px/frame) |
| `randomness` | `number` | 0 | Spatial variance in signal propagation (0-2) |

### Pulsing Effect (`pulsing`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | false | Enable breathing/pulsing mass effect |
| `speed` | `number` | 1 | Frequency of pulsing (0.1-3) |
| `depth` | `number` | 0.35 | Amplitude of pulsing (0.05-0.8) |

### Rendering Options (`render`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `points` | `boolean` | true | Show grid particles |
| `lines` | `boolean` | true | Show grid connections |
| `colorScheme` | `'neon' \| 'matrix' \| 'sunset'` | 'neon' | Predefined color scheme |

#### Particle Appearance (`render.particles`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shape` | `'circle' \| 'oval' \| 'square' \| 'diamond' \| 'star'` | 'circle' | Particle shape |
| `baseSize` | `number` | 1.2 | Base particle size |
| `baseOpacity` | `number` | 0.4 | Base particle opacity |
| `color` | `string` | undefined | Custom hex color (overrides theme if set) |

#### Motion-Only Rendering (`render.motion`)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | false | Only render moving particles |
| `speedThreshold` | `number` | 0.5 | Minimum speed to be visible |
| `displacementThreshold` | `number` | 0.6 | Minimum displacement to be visible |

## Examples

### Minimal Configuration

```tsx
const minimalConfig: SimulationConfig = {
  grid: { spacing: 40, stiffness: 0.2, damping: 0.92 },
  gravity: { strength: 10, radius: 200, divergence: 0, activationLatency: 0 },
  render: {
    points: true,
    lines: true,
    particles: {
      baseSize: 1.2,
      baseOpacity: 0.4,
      sizeVariance: 0,
      opacityVariance: 0,
      shape: 'circle'
    },
    colorScheme: 'neon',
    motion: { enabled: false }
  },
  signal: { enabled: false },
  pulsing: { enabled: false }
};
```

### Black Hole Simulation

```tsx
const blackHoleConfig: SimulationConfig = {
  ...minimalConfig,
  gravity: {
    ...minimalConfig.gravity,
    strength: 35,
    radius: 400,
    divergence: 0.3
  },
  signal: {
    enabled: true,
    speed: 12
  },
  pulsing: {
    enabled: true,
    speed: 0.8,
    depth: 0.5
  },
  render: {
    ...minimalConfig.render,
    particles: {
      ...minimalConfig.render.particles,
      shape: 'star'
    },
    colorScheme: 'sunset'
  }
};
```

### Repulsion Field

```tsx
const repulsionConfig: SimulationConfig = {
  ...minimalConfig,
  gravity: {
    ...minimalConfig.gravity,
    strength: -15
  },
  render: {
    ...minimalConfig.render,
    colorScheme: 'matrix',
    particles: {
      ...minimalConfig.render.particles,
      shape: 'diamond'
    }
  }
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
- **Signal Delay**: Enabling `signal.enabled` adds ~20% CPU overhead due to historical mouse position tracking.
- **Motion-Only Rendering**: Setting `render.motion.enabled: true` can reduce render time by 50-70% by only drawing moving particles.

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

- [Documentation Website](https://spacetime-fabric-docs.vercel.app) *(deployment pending)*
- [GitHub Repository](https://github.com/shashwatrathod/react-spacetime-fabric)
- [NPM Package](https://www.npmjs.com/package/react-spacetime-fabric) *(not yet published)*
