/**
 * Cursor Trail Configuration
 * 
 * Centralized configuration for the cursor trail effect.
 * Modify values here to customize the visual appearance and behavior.
 */

export const CURSOR_TRAIL_CONFIG = {
  /**
   * COLORS - Electric Lime Theme
   */
  colors: {
    // Primary trail color (Electric Lime)
    primary: {
      r: 183,
      g: 255,
      b: 60,
    },
    // Highlight color (White for premium effect)
    highlight: {
      r: 255,
      g: 255,
      b: 255,
    },
  },

  /**
   * TRAIL BEHAVIOR
   */
  trail: {
    // How long trail points persist (milliseconds)
    lifetime: 150,
    
    // Minimum speed to start showing trail (pixels/second)
    minSpeed: 0,
    
    // Base width of the trail (pixels)
    baseWidth: 2,
    
    // Maximum additional width from speed (pixels)
    speedWidthMultiplier: 4,
    
    // Speed divisor for calculating width (higher = less sensitive to speed)
    speedDivisor: 1000,
  },

  /**
   * GLOW LAYERS
   * Each layer creates depth in the trail effect
   */
  glow: {
    // Outer glow (widest, faintest)
    outer: {
      widthMultiplier: 3,
      alphaMultiplier: 0.15,
    },
    // Middle glow
    middle: {
      widthMultiplier: 1.8,
      alphaMultiplier: 0.4,
    },
    // Core line
    core: {
      widthMultiplier: 1,
      alphaMultiplier: 0.9,
    },
    // Bright highlight
    highlight: {
      widthMultiplier: 0.4,
      alphaMultiplier: 0.6,
    },
  },

  /**
   * PARTICLE SYSTEM
   */
  particles: {
    // Minimum speed to emit particles (pixels/second)
    emissionSpeedThreshold: 100,
    
    // Probability of emission when threshold met (0-1)
    // 0.3 = 30% chance per frame
    emissionProbability: 0.3,
    
    // Particle lifetime range (seconds)
    minLifetime: 0.3,
    maxLifetime: 0.6,
    
    // Particle size range (pixels)
    minSize: 2,
    maxSize: 5,
    
    // Velocity inheritance from cursor (0-1)
    // 0.1 = 10% of cursor velocity
    velocityInheritance: 0.1,
    
    // Random velocity spread (pixels/second)
    randomSpread: 50,
    
    // Drag coefficient (0-1, higher = more drag)
    // 0.95 = 5% slowdown per frame
    drag: 0.95,
    
    // Maximum number of active particles
    maxCount: 100,
    
    // Cleanup threshold (remove oldest when exceeding)
    cleanupThreshold: 80,
    
    // Glow intensity multipliers
    glowInner: 0.8,
    glowMid: 0.4,
    glowOuter: 0,
  },

  /**
   * PERFORMANCE
   */
  performance: {
    // Target FPS (affects deltaTime calculations)
    targetFPS: 60,
    
    // Minimum alpha before skipping draw
    minAlphaThreshold: 0.01,
    
    // Minimum width before skipping draw
    minWidthThreshold: 0.1,
  },

  /**
   * CANVAS
   */
  canvas: {
    // Z-index (should be above content but below modals)
    zIndex: 50,
    
    // Line cap style
    lineCap: "round" as CanvasLineCap,
    
    // Line join style
    lineJoin: "round" as CanvasLineJoin,
  },

  /**
   * ACCESSIBILITY
   */
  accessibility: {
    // Respect prefers-reduced-motion
    respectReducedMotion: true,
    
    // Disable on touch-only devices
    disableOnTouch: true,
  },
} as const;

/**
 * Helper function to get RGBA string
 */
export function getRGBA(
  color: { r: number; g: number; b: number },
  alpha: number
): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

/**
 * Preset configurations for easy customization
 */
export const CURSOR_TRAIL_PRESETS = {
  /**
   * Default: Electric Lime (Current)
   */
  default: CURSOR_TRAIL_CONFIG,

  /**
   * Subtle: Less prominent, more professional
   */
  subtle: {
    ...CURSOR_TRAIL_CONFIG,
    trail: {
      ...CURSOR_TRAIL_CONFIG.trail,
      lifetime: 100,
      baseWidth: 1.5,
      speedWidthMultiplier: 3,
    },
    glow: {
      outer: { widthMultiplier: 2.5, alphaMultiplier: 0.1 },
      middle: { widthMultiplier: 1.5, alphaMultiplier: 0.3 },
      core: { widthMultiplier: 1, alphaMultiplier: 0.7 },
      highlight: { widthMultiplier: 0.3, alphaMultiplier: 0.4 },
    },
    particles: {
      ...CURSOR_TRAIL_CONFIG.particles,
      emissionSpeedThreshold: 200,
      emissionProbability: 0.2,
    },
  },

  /**
   * Intense: More dramatic, gaming feel
   */
  intense: {
    ...CURSOR_TRAIL_CONFIG,
    trail: {
      ...CURSOR_TRAIL_CONFIG.trail,
      lifetime: 200,
      baseWidth: 3,
      speedWidthMultiplier: 6,
    },
    glow: {
      outer: { widthMultiplier: 4, alphaMultiplier: 0.25 },
      middle: { widthMultiplier: 2.5, alphaMultiplier: 0.6 },
      core: { widthMultiplier: 1.5, alphaMultiplier: 1 },
      highlight: { widthMultiplier: 0.6, alphaMultiplier: 0.8 },
    },
    particles: {
      ...CURSOR_TRAIL_CONFIG.particles,
      emissionSpeedThreshold: 50,
      emissionProbability: 0.5,
      maxCount: 150,
    },
  },

  /**
   * Minimal: Barely visible, elegant
   */
  minimal: {
    ...CURSOR_TRAIL_CONFIG,
    trail: {
      ...CURSOR_TRAIL_CONFIG.trail,
      lifetime: 80,
      baseWidth: 1,
      speedWidthMultiplier: 2,
    },
    glow: {
      outer: { widthMultiplier: 2, alphaMultiplier: 0.08 },
      middle: { widthMultiplier: 1.3, alphaMultiplier: 0.2 },
      core: { widthMultiplier: 0.8, alphaMultiplier: 0.5 },
      highlight: { widthMultiplier: 0.2, alphaMultiplier: 0.3 },
    },
    particles: {
      ...CURSOR_TRAIL_CONFIG.particles,
      emissionSpeedThreshold: 300,
      emissionProbability: 0.15,
      maxCount: 50,
    },
  },

  /**
   * Performance: Optimized for lower-end devices
   */
  performance: {
    ...CURSOR_TRAIL_CONFIG,
    trail: {
      ...CURSOR_TRAIL_CONFIG.trail,
      lifetime: 100,
      baseWidth: 2,
      speedWidthMultiplier: 3,
    },
    glow: {
      // Only 2 layers instead of 4
      outer: { widthMultiplier: 2, alphaMultiplier: 0.2 },
      middle: { widthMultiplier: 1, alphaMultiplier: 0 }, // disabled
      core: { widthMultiplier: 1, alphaMultiplier: 0.8 },
      highlight: { widthMultiplier: 0, alphaMultiplier: 0 }, // disabled
    },
    particles: {
      ...CURSOR_TRAIL_CONFIG.particles,
      emissionSpeedThreshold: 150,
      emissionProbability: 0.2,
      maxCount: 50,
      cleanupThreshold: 40,
    },
  },
} as const;

/**
 * Usage Example:
 * 
 * // In cursor-trail.tsx, replace hardcoded values with:
 * import { CURSOR_TRAIL_CONFIG, getRGBA } from '@/lib/config/cursor-trail-config';
 * 
 * // Instead of:
 * const cutoff = now - 150;
 * // Use:
 * const cutoff = now - CURSOR_TRAIL_CONFIG.trail.lifetime;
 * 
 * // Instead of:
 * ctx.strokeStyle = `rgba(183, 255, 60, ${alpha * 0.15})`;
 * // Use:
 * ctx.strokeStyle = getRGBA(
 *   CURSOR_TRAIL_CONFIG.colors.primary,
 *   alpha * CURSOR_TRAIL_CONFIG.glow.outer.alphaMultiplier
 * );
 */
