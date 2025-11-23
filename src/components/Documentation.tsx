
import React, { useState } from 'react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'physics' | 'tech'>('physics');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,255,242,0.05)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex gap-6">
            <button 
              onClick={() => setActiveTab('physics')}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'physics' ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}
            >
              Physics Model
            </button>
            <button 
              onClick={() => setActiveTab('tech')}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'tech' ? 'text-cyan-400' : 'text-white/40 hover:text-white'}`}
            >
              Technical Specs
            </button>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8 custom-scrollbar">
          
          {/* PHYSICS TAB */}
          {activeTab === 'physics' && (
            <div className="space-y-12 text-gray-300 font-light leading-relaxed">
              
              <section>
                <h3 className="text-2xl text-white font-thin mb-4 border-l-2 border-cyan-500 pl-4">1. The Discrete Manifold</h3>
                <p className="mb-4">
                  The simulation models spacetime not as a continuous continuum, but as a discrete <strong>Mass-Spring-Damper system</strong>. 
                  We utilize a Euclidean grid where each intersection point represents a coordinate in space $P(x, y)$.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                  <div className="bg-white/5 p-6 rounded-lg border border-white/5">
                    <h4 className="text-xs font-bold text-cyan-500 uppercase mb-2">Forces Involved</h4>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li><strong>Elasticity ($k$):</strong> Hooke's Law restoring points to neighbors.</li>
                      <li><strong>Memory ($M$):</strong> A weak force pulling points to their original $t=0$ coordinates.</li>
                      <li><strong>Damping ($\zeta$):</strong> Velocity-dependent friction to prevent infinite oscillation.</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center border border-dashed border-white/20 rounded-lg p-4">
                     {/* CSS Diagram of a Spring */}
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full left-0 top-1/2 -translate-y-1/2"></div>
                        <div className="absolute w-2 h-2 bg-cyan-500 rounded-full right-0 top-1/2 -translate-y-1/2"></div>
                        <svg className="absolute inset-0 w-full h-full text-white/50" viewBox="0 0 100 100">
                           <path d="M 10 50 Q 20 20 30 50 T 50 50 T 70 50 T 90 50" fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>
                        <div className="absolute top-2/3 text-[10px] text-white/40">F = -k(x - x₀)</div>
                     </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl text-white font-thin mb-4 border-l-2 border-cyan-500 pl-4">2. Integration Method</h3>
                <p className="mb-4">
                  To solve the motion equations, we use <strong>Verlet Integration</strong>. Unlike Euler integration, Verlet is symplectic (conserves energy better) and numerically stable for constraints.
                </p>
                <div className="font-mono text-sm bg-black p-4 rounded border border-white/10 text-cyan-200 overflow-x-auto">
                  x(t + dt) ≈ 2x(t) - x(t - dt) + a(t)dt²
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  We determine the next position based purely on the current position and the previous position, implicitly calculating velocity. This removes the need to store velocity vectors explicitly for the basic motion.
                </p>
              </section>

              <section>
                <h3 className="text-2xl text-white font-thin mb-4 border-l-2 border-cyan-500 pl-4">3. Gravity & Signal Delay</h3>
                <p className="mb-4">
                  The cursor acts as a massive object. However, information about the object's position cannot travel faster than light ($c$).
                </p>
                <p className="mb-4">
                  When <strong>Finite Signal Speed</strong> is enabled, the force felt by a particle at position $P$ is not based on the cursor's current position $M(t)$, but its position in the past $M(t - \Delta t)$, where:
                </p>
                <div className="font-mono text-sm bg-black p-4 rounded border border-white/10 text-cyan-200 mb-4">
                  Δt = distance(P, M) / c
                </div>
                <p className="text-sm text-gray-400">
                  This creates "Retarded Potentials", causing the gravity well to lag behind the object, creating a wake (Cherenkov-like radiation) when velocity exceeds propagation speed.
                </p>
              </section>

              <section>
                 <h3 className="text-2xl text-white font-thin mb-4 border-l-2 border-cyan-500 pl-4">4. Expansion Randomness</h3>
                 <p className="mb-4">
                    The metric tensor is perturbed by an anisotropic noise function to simulate "Expansion Randomness". The effective gravity interaction radius {'$R_{eff}$'} is modulated by the angle $\theta$ and a time-varying phase $\phi$:
                 </p>
                 <div className="font-mono text-sm bg-black p-4 rounded border border-white/10 text-cyan-200">
                    R_eff(θ, t) = R_base * (1 + Σ [sin(nθ + ωt)] * randomness)
                 </div>
              </section>

            </div>
          )}

          {/* TECHNICAL TAB */}
          {activeTab === 'tech' && (
            <div className="space-y-12 text-gray-300 font-light">
              
              <section>
                <h3 className="text-xl text-white font-bold mb-6">Architecture</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-white/10 rounded bg-white/5">
                    <div className="text-cyan-400 font-mono text-xs mb-2">CORE LOOP</div>
                    <div className="font-bold text-white mb-2">RequestAnimationFrame</div>
                    <p className="text-sm">
                      The simulation runs outside of React's render cycle. 
                      We use a `useRef` based game loop to update particle coordinates directly, ensuring 60FPS performance even with 2000+ nodes.
                    </p>
                  </div>
                  <div className="p-4 border border-white/10 rounded bg-white/5">
                    <div className="text-cyan-400 font-mono text-xs mb-2">RENDERING</div>
                    <div className="font-bold text-white mb-2">HTML5 Canvas 2D</div>
                    <p className="text-sm">
                      Rendering is batched. We do not use individual DOM elements (which would be slow). 
                      We use a single canvas layer, clearing and redrawing the entire state every frame (`ctx.beginPath`, `ctx.stroke`, etc.).
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl text-white font-bold mb-6">Simulation Props</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/20 text-white/50 uppercase text-xs">
                        <th className="py-2">Prop</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-cyan-300">gridSpacing</td>
                        <td className="py-3 text-white/60">number</td>
                        <td className="py-3">Distance between nodes. Lower = higher CPU load.</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-cyan-300">stiffness</td>
                        <td className="py-3 text-white/60">0.0 - 1.0</td>
                        <td className="py-3">Constraint rigidity. High values can cause explosion/instability.</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-cyan-300">damping</td>
                        <td className="py-3 text-white/60">0.0 - 1.0</td>
                        <td className="py-3">Energy loss per frame. 1.0 = perpetual motion.</td>
                      </tr>
                       <tr className="border-b border-white/5">
                        <td className="py-3 text-cyan-300">cursorActivationLatency</td>
                        <td className="py-3 text-white/60">ms</td>
                        <td className="py-3">Delay before gravity activates after movement stops.</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-cyan-300">gravityDivergence</td>
                        <td className="py-3 text-white/60">number</td>
                        <td className="py-3">Asymmetry factor for the gravity well shape.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                 <h3 className="text-xl text-white font-bold mb-4">State Management</h3>
                 <p className="text-sm leading-relaxed mb-4">
                   We bypass React state for the physics entities (`points`, `sticks`) to prevent re-rendering the component tree on every frame. 
                   React state is used <strong>only</strong> for configuration (UI controls).
                 </p>
                 <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-200 text-xs">
                    <strong>Warning:</strong> Modifying the array length of `points` (e.g., changing grid spacing) requires a full re-initialization of the grid, which is handled by a `useEffect` dependency.
                 </div>
              </section>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
