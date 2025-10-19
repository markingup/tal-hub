# Animation Strategy Plan - TALHub

## Current State Analysis ✅
- ✅ `tailwindcss-animate` already installed
- ✅ Radix UI components present (dialogs, sheets, etc.)
- ✅ Basic CSS animations exist (spinner, pulse)
- ✅ Design tokens established
- ❌ No animation duration/easing tokens
- ❌ No reduced motion support
- ❌ No clear animation strategy

## Optimized Recommendation (TL;DR)
**Phase 1**: CSS transitions + existing Radix components (0 new deps)
**Phase 2**: Add @formkit/auto-animate for layout animations (~2KB)
**Phase 3**: Consider motion-one only for complex sequences (~6KB)

## Implementation Plan

### Phase 1: Foundation (30 mins)
1. **Add animation tokens to globals.css**
```css
:root {
  /* Animation tokens */
  --ease-standard: cubic-bezier(.2,.8,.2,1);
  --ease-emph: cubic-bezier(.2,.7,0,1);
  --dur-fast: 120ms;    /* hover/focus */
  --dur-normal: 200ms;  /* enter/exit */
  --dur-slow: 320ms;    /* larger moves */
}
```

2. **Create useReducedMotion hook**
```typescript
// src/lib/hooks/useReducedMotion.ts
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
```

3. **Add reduced motion CSS**
```css
.reduced-motion * {
  animation: none !important;
  transition: none !important;
}
```

### Phase 2: Auto-Animate Integration (15 mins)
1. **Install package**
```bash
npm install @formkit/auto-animate
```

2. **Create useAutoAnimate hook**
```typescript
// src/lib/hooks/useAutoAnimate.ts
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
```

### Phase 3: Component Updates (45 mins)
1. **Update existing components with transitions**
   - Case cards: hover scale + shadow
   - Buttons: focus/hover states
   - Dialogs: fade in/out
   - Loading states: smooth transitions

2. **Add auto-animate to lists**
   - Case list reordering
   - Document list updates
   - Message list changes
   - Deadline list modifications

## Usage Guidelines

### CSS Transitions (Default)
```typescript
// Hover effects
className="transition-all duration-[var(--dur-fast)] hover:scale-105 hover:shadow-md"

// Focus states
className="transition-colors duration-[var(--dur-fast)] focus:ring-2 focus:ring-primary"

// Enter/exit animations
className="transition-opacity duration-[var(--dur-normal)] ease-[var(--ease-standard)]"
```

### Auto-Animate (Layout Changes)
```typescript
import { useAutoAnimate } from '@/lib/hooks/useAutoAnimate';

function CaseList({ cases }) {
  const [parent] = useAutoAnimate();
  
  return (
    <div ref={parent}>
      {cases.map(case => <CaseCard key={case.id} {...case} />)}
    </div>
  );
}
```

### Radix Presence (Conditional UI)
```typescript
import { Presence } from '@radix-ui/react-presence';

function ConditionalContent({ isOpen }) {
  return (
    <Presence present={isOpen}>
      <div className="transition-opacity duration-[var(--dur-normal)] data-[state=open]:animate-in data-[state=closed]:animate-out">
        Content here
      </div>
    </Presence>
  );
}
```

## Priority Implementation Order
1. **High Impact, Low Effort**
   - Add animation tokens to globals.css
   - Update button hover states
   - Add smooth transitions to case cards

2. **Medium Impact, Medium Effort**
   - Implement useReducedMotion hook
   - Add auto-animate to case list
   - Update dialog animations

3. **Low Impact, High Effort**
   - Complex sequence animations (if needed)
   - Motion-one integration (only if required)

## Success Metrics
- ✅ Zero custom animation code maintenance
- ✅ Consistent animation timing across app
- ✅ Accessibility compliance (reduced motion)
- ✅ Bundle size impact < 10KB total
- ✅ Developer experience: drop-in hooks

## Next Steps
1. Implement Phase 1 (foundation)
2. Test with existing components
3. Add Phase 2 (auto-animate) if needed
4. Document usage patterns in CONTRIBUTING.md