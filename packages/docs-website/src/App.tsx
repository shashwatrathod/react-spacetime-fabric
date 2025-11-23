
import React, { useState } from 'react';
import { SpacetimeCanvas, SimulationConfig } from 'react-spacetime-fabric';
import Documentation from './components/Documentation';

const App: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
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
    pulsing: {
      enabled: false,
      speed: 1,
      depth: 0.35
    },
    signal: {
      enabled: false,
      speed: 15,
      randomness: 0
    },
    render: {
      points: true,
      lines: true,
      motion: {
        enabled: false,
        speedThreshold: 0.5,
        displacementThreshold: 0.6
      },
      particles: {
        baseSize: 1.2,
        baseOpacity: 0.4,
        sizeVariance: 0,
        opacityVariance: 0,
        shape: 'circle',
        color: undefined
      },
      colorScheme: 'neon'
    }
  });

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-gray-200">
      
      {/* Simulation Layer */}
      <SpacetimeCanvas config={config} />

      {/* Documentation Layer */}
      <Documentation isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Intro Overlay */}
      {showIntro && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-700">
          <div className="max-w-md p-8 text-center border border-white/10 rounded-3xl bg-black/40 shadow-[0_0_50px_rgba(0,255,242,0.1)]">
            <h1 className="text-5xl font-thin tracking-widest text-white mb-6">
              GRAVITY
            </h1>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed tracking-wide">
              Observing spacetime curvature from a top-down reference frame.
              <br/><br/>
              The grid represents the fabric of space. Your cursor represents a mass traversing it.
            </p>
            <button 
              onClick={() => setShowIntro(false)}
              className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-cyan-500/50 text-cyan-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-400"
            >
              <span className="relative text-xs font-bold tracking-[0.2em] uppercase">Initialize</span>
            </button>
          </div>
        </div>
      )}

      {/* Header / HUD */}
      <div className={`absolute top-0 left-0 w-full p-8 flex justify-between items-start pointer-events-none z-40 transition-opacity duration-500 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <div className="pointer-events-auto">
          <h2 className="text-[10px] font-bold tracking-[0.3em] text-cyan-500/70 uppercase mb-1">Observation Deck</h2>
          <div className="text-xl font-light tracking-wider text-white/90 mb-4">Relative Spacetime</div>
          
          <button 
            onClick={() => setIsDocsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            System Info
          </button>
        </div>
        
        <div className="pointer-events-auto">
          <button 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
            aria-label="Settings"
          >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-100/70 group-hover:rotate-90 transition-transform duration-700">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
             </svg>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/5 transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-50 p-8 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Parameters</h3>
          <button onClick={() => setIsPanelOpen(false)} className="text-white/40 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="space-y-10">
          {/* Gravity Strength */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Mass (M)</label>
              <span className="text-xs font-mono text-white/60">{config.gravity.strength}</span>
            </div>
            <input 
              type="range" 
              min="-20" 
              max="40" 
              step="1"
              value={config.gravity.strength}
              onChange={(e) => setConfig({ ...config, gravity: { ...config.gravity, strength: Number(e.target.value) } })}
              className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
          </div>

          {/* Influence Radius */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Event Horizon (R)</label>
              <span className="text-xs font-mono text-white/60">{config.gravity.radius}px</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="600" 
              value={config.gravity.radius}
              onChange={(e) => setConfig({ ...config, gravity: { ...config.gravity, radius: Number(e.target.value) } })}
              className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
          </div>

          {/* Expansion Asymmetry */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Expansion Randomness</label>
              <span className="text-xs font-mono text-white/60">{(config.gravity.divergence * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1"
              value={config.gravity.divergence}
              onChange={(e) => setConfig({ ...config, gravity: { ...config.gravity, divergence: Number(e.target.value) } })}
              className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
          </div>

          {/* Activation Latency */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Activation Latency</label>
              <span className="text-xs font-mono text-white/60">{config.gravity.activationLatency}ms</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="100"
              value={config.gravity.activationLatency}
              onChange={(e) => setConfig({ ...config, gravity: { ...config.gravity, activationLatency: Number(e.target.value) } })}
              className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
          </div>

          {/* Grid Density */}
          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Fabric Density</label>
              <span className="text-xs font-mono text-white/60">{config.grid.spacing}px</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="80" 
              step="5"
              value={config.grid.spacing}
              onChange={(e) => setConfig({ ...config, grid: { ...config.grid, spacing: Number(e.target.value) } })}
              className="w-full h-[2px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
            />
          </div>

          {/* Vis Options */}
          <div className="space-y-4 pt-6 border-t border-white/5">
             <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-[2px] border ${config.render.lines ? 'bg-cyan-500/80 border-cyan-500' : 'border-white/20'} flex items-center justify-center transition-all`}></div>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">Grid Lines</span>
                    <input type="checkbox" className="hidden" checked={config.render.lines} onChange={(e) => setConfig({...config, render: { ...config.render, lines: e.target.checked }})} />
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-[2px] border ${config.render.points ? 'bg-cyan-500/80 border-cyan-500' : 'border-white/20'} flex items-center justify-center transition-all`}></div>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">Particles</span>
                    <input type="checkbox" className="hidden" checked={config.render.points} onChange={(e) => setConfig({...config, render: { ...config.render, points: e.target.checked }})} />
                </label>
                
                {/* Particle Customization Controls */}
                {config.render.points && (
                  <div className="col-span-2 space-y-4 pt-2 pl-7 animate-in fade-in slide-in-from-top-2 duration-300 border-l border-white/10">
                     <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Base Size</label>
                        <span className="text-[10px] font-mono text-white/40">{config.render.particles.baseSize.toFixed(1)}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="5.0" 
                        step="0.1"
                        value={config.render.particles.baseSize}
                        onChange={(e) => setConfig({ ...config, render: { ...config.render, particles: { ...config.render.particles, baseSize: Number(e.target.value) } } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Size Variance</label>
                            <span className="text-[10px] font-mono text-white/40">{config.render.particles.sizeVariance.toFixed(1)}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="3" 
                            step="0.1"
                            value={config.render.particles.sizeVariance}
                            onChange={(e) => setConfig({ ...config, render: { ...config.render, particles: { ...config.render.particles, sizeVariance: Number(e.target.value) } } })}
                            className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                        />
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Base Opacity</label>
                        <span className="text-[10px] font-mono text-white/40">{Math.round(config.render.particles.baseOpacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05"
                        value={config.render.particles.baseOpacity}
                        onChange={(e) => setConfig({ ...config, render: { ...config.render, particles: { ...config.render.particles, baseOpacity: Number(e.target.value) } } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Opacity Variance</label>
                            <span className="text-[10px] font-mono text-white/40">{config.render.particles.opacityVariance.toFixed(2)}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="0.5" 
                            step="0.05"
                            value={config.render.particles.opacityVariance}
                            onChange={(e) => setConfig({ ...config, render: { ...config.render, particles: { ...config.render.particles, opacityVariance: Number(e.target.value) } } })}
                            className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 block mb-2">Shape</label>
                        <div className="grid grid-cols-5 gap-1">
                            {['circle', 'oval', 'square', 'diamond', 'star'].map((shape) => (
                                <button
                                    key={shape}
                                    onClick={() => setConfig({...config, render: { ...config.render, particles: { ...config.render.particles, shape: shape as any } }})}
                                    className={`h-6 rounded text-[9px] uppercase border transition-all ${config.render.particles.shape === shape ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                >
                                    {shape.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                            <div className={`w-3 h-3 rounded-[2px] border ${config.render.particles.color ? 'bg-cyan-500/80 border-cyan-500' : 'border-white/20'} flex items-center justify-center`}></div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Custom Color</span>
                            <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={!!config.render.particles.color} 
                                onChange={(e) => {
                                    const newColor = e.target.checked ? '#ffffff' : undefined;
                                    setConfig({...config, render: { ...config.render, particles: { ...config.render.particles, color: newColor } }});
                                }} 
                            />
                        </label>
                        
                        {config.render.particles.color && (
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={config.render.particles.color}
                                    onChange={(e) => {
                                        setConfig({...config, render: { ...config.render, particles: { ...config.render.particles, color: e.target.value } }});
                                    }}
                                    className="w-full h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                                />
                            </div>
                        )}
                    </div>
                  </div>
                )}
                
                <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                    <div className={`w-4 h-4 rounded-[2px] border ${config.render.motion?.enabled ? 'bg-cyan-500/80 border-cyan-500' : 'border-white/20'} flex items-center justify-center transition-all`}></div>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">Show Motion Only</span>
                    <input type="checkbox" className="hidden" checked={config.render.motion?.enabled ?? false} onChange={(e) => setConfig({...config, render: { ...config.render, motion: { ...config.render.motion!, enabled: e.target.checked } }})} />
                </label>

                {/* Motion Threshold Controls */}
                {config.render.motion?.enabled && (
                  <div className="col-span-2 space-y-4 pt-2 pl-7 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Speed Threshold</label>
                        <span className="text-[10px] font-mono text-white/40">{config.render.motion?.speedThreshold?.toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        value={config.render.motion?.speedThreshold ?? 0.5}
                        onChange={(e) => setConfig({ ...config, render: { ...config.render, motion: { ...config.render.motion!, speedThreshold: Number(e.target.value) } } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Disp. Threshold</label>
                        <span className="text-[10px] font-mono text-white/40">{config.render.motion?.displacementThreshold?.toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        value={config.render.motion?.displacementThreshold ?? 0.6}
                        onChange={(e) => setConfig({ ...config, render: { ...config.render, motion: { ...config.render.motion!, displacementThreshold: Number(e.target.value) } } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                    <div className={`w-4 h-4 rounded-[2px] border ${config.pulsing.enabled ? 'bg-cyan-500/80 border-cyan-500' : 'border-white/20'} flex items-center justify-center transition-all`}></div>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">Breathing Effect</span>
                    <input type="checkbox" className="hidden" checked={config.pulsing.enabled} onChange={(e) => setConfig({...config, pulsing: { ...config.pulsing, enabled: e.target.checked }})} />
                </label>
                
                {/* Breathing Parameters */}
                {config.pulsing.enabled && (
                  <div className="col-span-2 space-y-4 pt-2 pl-7 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Rate</label>
                        <span className="text-[10px] font-mono text-white/40">{config.pulsing.speed?.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="3" 
                        step="0.1"
                        value={config.pulsing.speed ?? 1}
                        onChange={(e) => setConfig({ ...config, pulsing: { ...config.pulsing, speed: Number(e.target.value) } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Depth</label>
                        <span className="text-[10px] font-mono text-white/40">{((config.pulsing.depth ?? 0.1) * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.05" 
                        max="0.8" 
                        step="0.05"
                        value={config.pulsing.depth ?? 0.1}
                        onChange={(e) => setConfig({ ...config, pulsing: { ...config.pulsing, depth: Number(e.target.value) } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer group col-span-2 mt-2">
                    <div className={`w-4 h-4 rounded-[2px] border ${config.signal.enabled ? 'bg-cyan-500/80 border-cyan-500' : 'border-white/20'} flex items-center justify-center transition-all`}></div>
                    <span className="text-xs text-white/60 group-hover:text-white transition-colors">Finite Signal Speed</span>
                    <input type="checkbox" className="hidden" checked={config.signal.enabled} onChange={(e) => setConfig({...config, signal: { ...config.signal, enabled: e.target.checked }})} />
                </label>

                {config.signal.enabled && (
                   <div className="col-span-2 space-y-4 pt-2 pl-7 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Speed (c)</label>
                        <span className="text-[10px] font-mono text-white/40">{config.signal.speed} px/f</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="60" 
                        step="1"
                        value={config.signal.speed ?? 15}
                        onChange={(e) => setConfig({ ...config, signal: { ...config.signal, speed: Number(e.target.value) } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40">Randomness</label>
                        <span className="text-[10px] font-mono text-white/40">{((config.signal.randomness ?? 0) * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="0.1"
                        value={config.signal.randomness ?? 0}
                        onChange={(e) => setConfig({ ...config, signal: { ...config.signal, randomness: Number(e.target.value) } })}
                        className="w-full h-[1px] bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400/70"
                      />
                    </div>
                   </div>
                )}

             </div>
          </div>

          {/* Theme */}
           <div className="space-y-4 pt-6 border-t border-white/5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/70">Spectrum</label>
            <div className="grid grid-cols-3 gap-2">
                {['neon', 'matrix', 'sunset'].map((theme) => (
                    <button 
                        key={theme}
                        onClick={() => setConfig({...config, render: { ...config.render, colorScheme: theme as any }})}
                        className={`py-2 text-[10px] uppercase tracking-wider rounded border transition-all ${config.render.colorScheme === theme ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(0,255,242,0.1)]' : 'border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
                    >
                        {theme}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
