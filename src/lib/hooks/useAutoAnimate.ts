import { useAutoAnimate as useAutoAnimateLib } from '@formkit/auto-animate/react';
import { useReducedMotion } from './useReducedMotion';

export function useAutoAnimate(options?: { duration?: number; easing?: string }) {
  const reducedMotion = useReducedMotion();
  const [parent] = useAutoAnimateLib({
    duration: reducedMotion ? 0 : (options?.duration || 200),
    easing: options?.easing || 'var(--ease-standard)',
  });
  
  return [parent];
}
