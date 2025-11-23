
import { Point, Stick, SimulationConfig } from './types';

export class SpacetimeSimulation {
  points: Point[] = [];
  sticks: Stick[] = [];
  mouse: { x: number; y: number } = { x: -1000, y: -1000 };
  mouseHistory: { x: number; y: number }[] = [];
  lastMouseMoveTime: number = 0;
  
  width: number = 0;
  height: number = 0;
  
  constructor(public config: SimulationConfig) {}

  setConfig(config: SimulationConfig) {
    this.config = config;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initGrid();
  }

  setMouse(x: number, y: number) {
    this.mouse = { x, y };
    this.lastMouseMoveTime = Date.now();
  }

  private initGrid() {
    this.points = [];
    this.sticks = [];
    
    const spacing = this.config.grid.spacing;
    const padding = 150; 
    const cols = Math.ceil((this.width + padding * 2) / spacing);
    const rows = Math.ceil((this.height + padding * 2) / spacing);
    const startX = -padding;
    const startY = -padding;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const px = startX + x * spacing;
        const py = startY + y * spacing;
        this.points.push({
          x: px,
          y: py,
          oldX: px,
          oldY: py,
          baseX: px,
          baseY: py,
          pinned: false,
          randomSeed: Math.random()
        });
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const index = y * cols + x;
        if (x < cols - 1) {
          this.sticks.push({
            p1: this.points[index],
            p2: this.points[index + 1],
            length: spacing
          });
        }
        if (y < rows - 1) {
          this.sticks.push({
            p1: this.points[index],
            p2: this.points[index + cols],
            length: spacing
          });
        }
      }
    }
  }

  update(pulsingPhase: number) {
    const { 
        radius: mouseInteractionRadius, 
        strength: mouseForce, 
        divergence: gravityDivergence,
        activationLatency: cursorActivationLatency
    } = this.config.gravity;

    const { damping, stiffness } = this.config.grid;
    
    const { 
        enabled: pulsing, 
        depth: pulsingDepth = 0.1,
        speed: pulsingSpeed = 1
    } = this.config.pulsing;

    const { 
        enabled: enableSignalDelay, 
        speed: signalSpeed = 15, 
        randomness: signalRandomness = 0 
    } = this.config.signal;

    const now = Date.now();
    const timeSinceMove = now - this.lastMouseMoveTime;
    let activeMouseForce = mouseForce;
    
    if (cursorActivationLatency > 0 && timeSinceMove < cursorActivationLatency) {
        activeMouseForce = 0;
    }

    // Update Mouse History
    if (enableSignalDelay) {
        this.mouseHistory.unshift({ x: this.mouse.x, y: this.mouse.y });
        if (this.mouseHistory.length > 500) {
            this.mouseHistory.pop();
        }
    } else {
        if (this.mouseHistory.length > 1) {
             this.mouseHistory = [{x: this.mouse.x, y: this.mouse.y}];
        }
    }

    const calculateForce = (baseForce: number, phase: number) => {
        if (!pulsing) return baseForce;
        return baseForce + (baseForce * pulsingDepth * Math.sin(phase));
    };

    const globalForce = calculateForce(activeMouseForce, pulsingPhase);

    // Update Points
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if (p.pinned) continue;

      const vx = (p.x - p.oldX) * damping;
      const vy = (p.y - p.oldY) * damping;

      p.oldX = p.x;
      p.oldY = p.y;
      p.x += vx;
      p.y += vy;

      const baseDx = p.baseX - p.x;
      const baseDy = p.baseY - p.y;
      
      const elasticity = 0.015;
      p.x += baseDx * elasticity; 
      p.y += baseDy * elasticity;

      let targetX = this.mouse.x;
      let targetY = this.mouse.y;
      let effectiveForce = globalForce;

      const dx = p.x - targetX;
      const dy = p.y - targetY;
      const distSq = dx * dx + dy * dy;
      
      if (enableSignalDelay) {
          const distToCurrent = Math.sqrt(distSq);
          let effectiveSpeed = signalSpeed;
          
          if (signalRandomness > 0) {
             const angle = Math.atan2(dy, dx);
             const angularNoise = Math.sin(angle * 3.5) + Math.cos(angle * 5.2 + 1.2) * 0.7;
             const spatialNoise = (p.randomSeed - 0.5) * 2; 
             const totalNoise = (angularNoise + spatialNoise * 0.5) * 0.3; 
             effectiveSpeed = signalSpeed * (1 + totalNoise * signalRandomness);
             effectiveSpeed = Math.max(1, effectiveSpeed);
          }

          const delayFrames = Math.floor(distToCurrent / effectiveSpeed);
          const historyIndex = Math.min(delayFrames, this.mouseHistory.length - 1);
          const historicalMouse = this.mouseHistory[historyIndex] || {x: this.mouse.x, y: this.mouse.y};
          
          targetX = historicalMouse.x;
          targetY = historicalMouse.y;

          if (pulsing) {
             const delaySec = delayFrames * 0.016; 
             const retardedPhase = pulsingPhase - (delaySec * 1.25 * (this.config.pulsing.speed ?? 1));
             effectiveForce = calculateForce(activeMouseForce, retardedPhase);
          } else {
              effectiveForce = activeMouseForce;
          }
      }

      const histDx = p.x - targetX;
      const histDy = p.y - targetY;
      const histDistSq = histDx * histDx + histDy * histDy;

      let effectiveRadius = mouseInteractionRadius;
      if (gravityDivergence > 0) {
          const angle = Math.atan2(histDy, histDx);
          const t = pulsingPhase; 
          const lobe1 = Math.sin(angle * 3 + t);
          const lobe2 = Math.cos(angle * 5 - t * 0.7 + 1.5);
          const lobe3 = Math.sin(angle * 7.3 + t * 0.2 + 3);
          const shapeNoise = (lobe1 + lobe2 * 0.7 + lobe3 * 0.4) / 2.1; 
          const radiusMod = 1 + (shapeNoise * gravityDivergence);
          effectiveRadius = mouseInteractionRadius * Math.max(0.1, radiusMod);
      }

      if (histDistSq < effectiveRadius * effectiveRadius) {
        const dist = Math.sqrt(histDistSq);
        const normalizedDist = dist / effectiveRadius;
        const pullFactor = Math.pow(1 - normalizedDist, 2);
        const force = pullFactor * effectiveForce;
        const angle = Math.atan2(histDy, histDx);
        p.x -= Math.cos(angle) * force;
        p.y -= Math.sin(angle) * force;
      }
    }

    // Constraints
    const iterations = 3; 
    for (let j = 0; j < iterations; j++) {
      for (let i = 0; i < this.sticks.length; i++) {
        const s = this.sticks[i];
        const dx = s.p2.x - s.p1.x;
        const dy = s.p2.y - s.p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist === 0) continue;

        const diff = (s.length - dist) / dist * stiffness;
        const offsetX = dx * diff * 0.5;
        const offsetY = dy * diff * 0.5;

        if (!s.p1.pinned) {
          s.p1.x -= offsetX;
          s.p1.y -= offsetY;
        }
        if (!s.p2.pinned) {
          s.p2.x += offsetX;
          s.p2.y += offsetY;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
    const { 
        lines: renderLines, 
        points: renderPoints, 
        colorScheme, 
        motion,
        particles
    } = this.config.render;

    const {
        enabled: renderMotionOnly,
        speedThreshold: motionSpeedThreshold = 0.1,
        displacementThreshold: motionDisplacementThreshold = 0.1
    } = motion || { enabled: false };

    const {
        baseSize: particleBaseSize,
        baseOpacity: particleBaseOpacity,
        sizeVariance: particleSizeVariance,
        opacityVariance: particleOpacityVariance,
        shape: particleShape,
        color: customParticleColor
    } = particles;

    const { radius: mouseInteractionRadius } = this.config.gravity;

    const themeColors = {
        neon: { r: 0, g: 255, b: 242 },
        matrix: { r: 0, g: 255, b: 70 },
        sunset: { r: 255, g: 100, b: 50 }
    };

    let baseR, baseG, baseB;
    if (customParticleColor) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(customParticleColor);
        if (result) {
            baseR = parseInt(result[1], 16);
            baseG = parseInt(result[2], 16);
            baseB = parseInt(result[3], 16);
        } else {
             const t = themeColors[colorScheme];
             baseR = t.r; baseG = t.g; baseB = t.b;
        }
    } else {
        const t = themeColors[colorScheme];
        baseR = t.r; baseG = t.g; baseB = t.b;
    }

    const getSpeed = (p: Point) => {
        const vx = p.x - p.oldX;
        const vy = p.y - p.oldY;
        return Math.sqrt(vx * vx + vy * vy);
    };

    const getDisplacement = (p: Point) => {
        return Math.abs(p.x - p.baseX) + Math.abs(p.y - p.baseY);
    };

    if (renderLines) {
      const t = themeColors[colorScheme];
      
      for (let i = 0; i < this.sticks.length; i++) {
        const s = this.sticks[i];
        
        if (s.p1.x < -100 || s.p1.x > this.width + 100 || s.p1.y < -100 || s.p1.y > this.height + 100) continue;

        const midX = (s.p1.x + s.p2.x) / 2;
        const midY = (s.p1.y + s.p2.y) / 2;
        const distToMouse = Math.sqrt((midX - this.mouse.x) ** 2 + (midY - this.mouse.y) ** 2);
        
        let alpha = 0.1;

        if (renderMotionOnly) {
            const s1 = getSpeed(s.p1);
            const s2 = getSpeed(s.p2);
            const speed = Math.max(s1, s2);
            const d1 = getDisplacement(s.p1);
            const d2 = getDisplacement(s.p2);
            const disp = Math.max(d1, d2);

            if (speed < motionSpeedThreshold && disp < motionDisplacementThreshold) continue;
            alpha = Math.min(1, (speed - (motionSpeedThreshold * 0.8)) * 8); 
            if (alpha < 0.05) continue; 
        } else {
             if (distToMouse < mouseInteractionRadius * 1.5) {
                alpha += (1 - distToMouse / (mouseInteractionRadius * 1.5)) * 0.6;
            }
        }
        
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(${t.r}, ${t.g}, ${t.b}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(s.p1.x, s.p1.y);
        ctx.lineTo(s.p2.x, s.p2.y);
        ctx.stroke();
      }
    }

    if (renderPoints) {
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        
        if (p.x < -20 || p.x > this.width + 20 || p.y < -20 || p.y > this.height + 20) continue;

        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distSq = dx*dx + dy*dy;
        
        const seedCentered = p.randomSeed - 0.5;

        let size = particleBaseSize + (seedCentered * particleSizeVariance * 2);
        if (size < 0.1) size = 0.1;

        let alpha = particleBaseOpacity + (seedCentered * particleOpacityVariance);

        if (renderMotionOnly) {
            const speed = getSpeed(p);
            const disp = getDisplacement(p);

            if (speed < motionSpeedThreshold && disp < motionDisplacementThreshold) continue;

            let motionAlpha = Math.min(1, (speed - (motionSpeedThreshold * 0.8)) * 8);
            if (motionAlpha < 0.05) continue; 
            
            alpha = alpha * motionAlpha;
            size = size + (motionAlpha * 1.5);
        } else {
            if (distSq < mouseInteractionRadius * mouseInteractionRadius) {
                const dist = Math.sqrt(distSq);
                const factor = 1 - dist / mouseInteractionRadius;
                size += factor * 2;
                alpha += factor * 0.6;
            }
        }

        alpha = Math.max(0, Math.min(1, alpha));

        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${alpha})`;
        ctx.beginPath();
        
        if (particleShape === 'circle') {
             ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
             ctx.fill();
        }
        else if (particleShape === 'oval') {
            ctx.ellipse(p.x, p.y, size, size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        else if (particleShape === 'square') {
             ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
        }
        else if (particleShape === 'diamond') {
             ctx.save();
             ctx.translate(p.x, p.y);
             ctx.rotate(Math.PI / 4);
             ctx.fillRect(-size, -size, size * 2, size * 2);
             ctx.restore();
        }
        else if (particleShape === 'star') {
             ctx.save();
             ctx.translate(p.x, p.y);
             ctx.moveTo(0, -size * 1.5);
             ctx.quadraticCurveTo(size * 0.1, -size * 0.1, size * 1.5, 0);
             ctx.quadraticCurveTo(size * 0.1, size * 0.1, 0, size * 1.5);
             ctx.quadraticCurveTo(-size * 0.1, size * 0.1, -size * 1.5, 0);
             ctx.quadraticCurveTo(-size * 0.1, -size * 0.1, 0, -size * 1.5);
             ctx.fill();
             ctx.restore();
        }
      }
    }
  }
}
