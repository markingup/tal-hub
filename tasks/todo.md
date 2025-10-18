# Universal Navbar Rebuild Plan

## Overview
Rebuild the header component to be a universal, centered navbar that follows Unix principles and works across the entire codebase.

## Current State Analysis

### Current Header Issues
- **Not universal**: Different navigation patterns across pages (main header vs dashboard sidebar)
- **Not centered**: Left-aligned layout with flex justify-end
- **Violates Unix principles**: 
  - Single responsibility: Mixed concerns (branding, navigation, theme toggle)
  - Not composable: Hard-coded navigation items
  - Not configurable: Navigation items embedded in component

### Current Navigation Structure
- **Public pages**: Home, About, Docs (in main header)
- **Dashboard**: Overview, My Cases (in sidebar)
- **Auth pages**: Sign-in, callback
- **Legal pages**: Privacy, Terms, Help

## Unix Principles Application

### 1. Do One Thing Well
- **Navbar**: Pure navigation component
- **Brand**: Separate logo/brand component
- **Auth**: Separate user menu component
- **Theme**: Separate theme toggle component

### 2. Work Together
- **Config-driven**: Navigation items from config object
- **Composable**: Combine components via props
- **Interface-based**: Clear prop contracts

### 3. Text as Interface
- **Navigation config**: JSON structure for routes
- **Props**: Simple, readable interfaces
- **State**: Minimal, predictable state

### 4. KISS
- **Simple layout**: Centered, clean design
- **Minimal state**: Only essential state
- **Clear structure**: Logical component hierarchy

## Implementation Plan

### Phase 1: Configuration & Structure
- [ ] Create `lib/config/navigation.ts` with centralized navigation config
- [ ] Define navigation item interface
- [ ] Create auth-aware navigation logic

### Phase 2: Component Decomposition
- [ ] Extract `NavbarBrand` component
- [ ] Extract `NavbarNavigation` component  
- [ ] Extract `NavbarUserMenu` component
- [ ] Extract `NavbarMobileMenu` component

### Phase 3: Universal Navbar
- [ ] Create main `UniversalNavbar` component
- [ ] Implement centered layout
- [ ] Add responsive mobile menu
- [ ] Integrate auth-aware navigation

### Phase 4: Integration
- [ ] Update `Layout` component to use new navbar
- [ ] Update dashboard layout to use universal navbar
- [ ] Remove duplicate navigation code
- [ ] Test across all pages

### Phase 5: Polish & Testing
- [ ] Add active route highlighting
- [ ] Implement smooth transitions
- [ ] Test responsive breakpoints
- [ ] Verify accessibility

## Navigation Configuration Structure

```typescript
interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType;
  requiresAuth?: boolean;
  public?: boolean;
  mobile?: boolean;
}

interface NavigationConfig {
  brand: {
    name: string;
    href: string;
    logo?: React.ComponentType;
  };
  public: NavigationItem[];
  authenticated: NavigationItem[];
  mobile: NavigationItem[];
}
```

## Design Specifications

### Layout
- **Centered**: Navbar content centered with max-width container
- **Responsive**: Collapsible mobile menu
- **Sticky**: Fixed at top with backdrop blur
- **Height**: Consistent 64px height

### Visual Hierarchy
- **Brand**: Left side, prominent
- **Navigation**: Center, primary items
- **Actions**: Right side, secondary items (theme, user menu)

### Responsive Behavior
- **Desktop**: Full navigation visible
- **Tablet**: Condensed navigation
- **Mobile**: Hamburger menu with slide-out navigation

## Success Criteria

### Functional
- [ ] Works on all pages (public, dashboard, auth)
- [ ] Responsive across all breakpoints
- [ ] Auth-aware navigation items
- [ ] Active route highlighting
- [ ] Accessible keyboard navigation

### Technical
- [ ] Follows Unix principles
- [ ] Configurable navigation
- [ ] Composable components
- [ ] Minimal re-renders
- [ ] Type-safe interfaces

### User Experience
- [ ] Centered, balanced layout
- [ ] Smooth transitions
- [ ] Clear visual hierarchy
- [ ] Intuitive mobile experience

## Implementation Notes

### Component Structure
```
UniversalNavbar
├── NavbarBrand
├── NavbarNavigation (desktop)
├── NavbarMobileMenu (mobile)
└── NavbarActions
    ├── ThemeToggle
    └── UserMenu (auth-aware)
```

### State Management
- Use `usePathname()` for active route detection
- Use `useAuth()` for authentication state
- Minimal local state for mobile menu toggle

### Styling Approach
- Tailwind utility classes
- Consistent spacing and typography
- Responsive design patterns
- Dark/light theme support

## Next Steps
1. Create navigation configuration
2. Build component decomposition
3. Implement universal navbar
4. Update layouts
5. Test and polish

---

*This plan follows the Unix philosophy: simple, focused, composable components that work together to create a universal navigation experience.*
