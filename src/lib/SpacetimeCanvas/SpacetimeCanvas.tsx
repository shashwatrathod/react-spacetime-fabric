
import React, { useEffect, useRef } from 'react';
import { SimulationConfig } from './types';
import { SpacetimeSimulation } from './simulation';

export interface SpacetimeCanvasProps {
  /** Configuration object for the simulation */
  config: SimulationConfig;
  /** Optional className for the canvas element */
  className?: string;
}

/**
 * SpacetimeCanvas Component
 * 
 * Renders a interactive spacetime fabric simulation on a canvas.
 * The simulation visualizes gravity, time dilation (via signal delay), and other relativistic effects.
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
      className={className || "absolute top-0 left-0 w-full h-full cursor-none touch-none"}
    />
  );
};

export default SpacetimeCanvas;
