# React Spacetime Fabric

An interactive React component that renders a physics-based spacetime fabric simulation. Inspired by the animations on [Google Antigravity](https://antigravity.google).

[![NPM](https://img.shields.io/npm/v/react-spacetime-fabric?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/react-spacetime-fabric)
[![Docs](https://img.shields.io/badge/Docs-Website-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://react-spacetime-fabric.shashwatrathod.com)

## Installation

```bash
npm install react-spacetime-fabric
```

## Usage

```tsx
import { SpacetimeCanvas } from 'react-spacetime-fabric';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <SpacetimeCanvas 
        config={{
          grid: { spacing: 40 },
          gravity: { strength: 15, radius: 300 }
        }}
      />
    </div>
  );
}
```

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server (docs website):
   ```bash
   pnpm dev
   ```

## License

MIT © Shashwat Rathod
