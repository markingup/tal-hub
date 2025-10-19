import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduced, set] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => set(mediaQuery.matches);
    
    handler(); // Check initial state
    mediaQuery.addEventListener("change", handler);
    
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  
  return reduced;
}
