
import React, { useEffect, useRef } from 'react';
import { SimulationConfig } from './types';
import { SpacetimeSimulation } from './simulation';

/**
 * Props for the SpacetimeCanvas component
 */
export interface SpacetimeCanvasProps {
  /**
   * Configuration object for the simulation
   * @see SimulationConfig for all available options
   */
  config: SimulationConfig;
  
  /**
   * Optional className for the canvas element
   * If not provided, component uses inline styles for positioning
   * @default undefined
   */
  className?: string;
}

/**
 * SpacetimeCanvas Component
 * 
 * An interactive React component that renders a physics-based spacetime fabric simulation.
 * The simulation visualizes gravitational effects, time dilation (via finite signal speed),
 * and other relativistic phenomena on an HTML5 canvas.
 * 
 * @example
 * ```tsx
 * import { SpacetimeCanvas, SimulationConfig } from 'react-spacetime-fabric';
 * 
 * const config: SimulationConfig = {
 *   gridSpacing: 35,
 *   mouseForce: 10,
 *   mouseInteractionRadius: 280,
 *   enableSignalDelay: true,
 *   signalSpeed: 15,
 *   // ... other config options
 * };
 * 
 * function App() {
 *   return (
 *     <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
 *       <SpacetimeCanvas config={config} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param props - Component props
 * @returns A canvas element with the spacetime simulation
 */
const SpacetimeCanvas: React.FC<SpacetimeCanvasProps> = ({ config, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulationRef = useRef<SpacetimeSimulation | null>(null);
  const animationRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const totalPhaseRef = useRef<number>(0);

  // Initialize simulation instance once
  if (!simulationRef.current) {
    simulationRef.current = new SpacetimeSimulation(config);
  }

  // Update config when prop changes
  useEffect(() => {
    if (simulationRef.current) {
        const oldSpacing = simulationRef.current.config.gridSpacing;
        simulationRef.current.setConfig(config);
        
        // Re-initialize grid if spacing changes
        if (oldSpacing !== config.gridSpacing && canvasRef.current) {
             simulationRef.current.resize(canvasRef.current.width, canvasRef.current.height);
        }
    }
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simulation = simulationRef.current!;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      simulation.resize(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      simulation.setMouse(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault(); 
        if(e.touches.length > 0) {
            simulation.setMouse(e.touches[0].clientX, e.touches[0].clientY);
        }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Initial resize to set up grid
    handleResize();

    const render = () => {
      const now = Date.now();
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = now;
      
      const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1);
      lastFrameTimeRef.current = now;

      // Use the config from simulation instance to ensure we have the latest values
      totalPhaseRef.current += dt * 1.25 * simulation.config.pulsingSpeed;

      simulation.update(totalPhaseRef.current);
      simulation.draw(ctx);
      
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []); 

  return (
    <canvas 
      ref={canvasRef} 
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'none',
        touchAction: 'none',
        ...(!className && { /* Default styles only if no className provided */ })
      }}
    />
  );
};

export default SpacetimeCanvas;
