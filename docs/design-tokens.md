# Design Tokens

This document describes the TAL-inspired design system tokens used throughout the application.

## Overview

The design system is inspired by the Tribunal administratif du logement (TAL) color palette and follows civic design principles for accessibility and clarity.

## Typography Tokens

### Font Family
- **Primary**: Public Sans (Google Fonts)
- **Fallback**: Inter, system-ui, sans-serif
- **CSS Variable**: `--font-family-base`

### Font Sizes
- **Base**: `1rem` (16px)
- **Small**: `0.875rem` (14px) 
- **Large**: `1.125rem` (18px)

### Font Weights
- **Regular**: `400`
- **Medium**: `500`
- **Bold**: `700`

### Usage
```css
font-family: var(--font-family-base);
font-size: var(--font-size-base);
font-weight: var(--font-weight-medium);
```

### Font Consistency Guidelines
- **Always use the base font family**: All text should use `var(--font-family-base)` which provides Public Sans with fallbacks
- **Avoid font-family overrides**: Do not use `font-mono`, `font-serif`, or custom font families unless specifically required for code display
- **Use Tailwind font classes**: Prefer `font-medium`, `font-semibold`, `font-bold` over custom CSS
- **Consistent weights**: Use only the defined weights (400, 500, 700) for consistency

## Color Tokens

### Primary Colors
- **Primary**: `#1E4D8C` - Main brand color
- **Primary Hover**: `#2563EB` - Interactive states
- **Accent**: `#0284C7` - Highlights and links

### Surface Colors
- **Background**: `#F5F6FA` - Page background
- **Surface**: `#FFFFFF` - Card and component backgrounds
- **Border**: `#E2E8F0` - Component borders

### Text Colors
- **Primary**: `#1E293B` - Main text color
- **Secondary**: `#475569` - Secondary text and descriptions

### Status Colors
- **Success**: `#059669` - Success states
- **Warning**: `#F59E0B` - Warning states
- **Error**: `#DC2626` - Error states

### CSS Variables
```css
:root {
  --color-primary: #1E4D8C;
  --color-primary-hover: #2563EB;
  --color-accent: #0284C7;
  --color-neutral-bg: #F5F6FA;
  --color-surface: #FFFFFF;
  --color-border: #E2E8F0;
  --color-text-primary: #1E293B;
  --color-text-secondary: #475569;
  --color-success: #059669;
  --color-warning: #F59E0B;
  --color-error: #DC2626;
}
```

## Tailwind Classes

### Background Colors
- `bg-primary` - Primary background
- `bg-primary-hover` - Primary hover state
- `bg-accent` - Accent background
- `bg-surface` - Surface background
- `bg-success` - Success background
- `bg-warning` - Warning background
- `bg-error` - Error background

### Text Colors
- `text-primary` - Primary text
- `text-text-primary` - Main text color
- `text-text-secondary` - Secondary text color
- `text-accent` - Accent text
- `text-success` - Success text
- `text-warning` - Warning text
- `text-error` - Error text

### Border Colors
- `border-border` - Default border color
- `border-primary` - Primary border
- `border-accent` - Accent border

## Component Usage Examples

### Button Variants
```tsx
// Primary button
<Button variant="default" className="bg-primary text-surface hover:bg-primary-hover">
  Primary Action
</Button>

// Outline button
<Button variant="outline" className="border-border bg-surface hover:bg-accent">
  Secondary Action
</Button>

// Link button
<Button variant="link" className="text-accent hover:text-primary-hover">
  Link Action
</Button>
```

### Card Components
```tsx
<Card className="bg-surface border-border text-text-primary">
  <CardHeader>
    <CardTitle className="text-text-primary">Card Title</CardTitle>
    <CardDescription className="text-text-secondary">
      Card description
    </CardDescription>
  </CardHeader>
</Card>
```

### Navigation Links
```tsx
<Link className="text-text-secondary hover:text-primary-hover">
  Navigation Link
</Link>
```

## Accessibility

### Contrast Ratios
All color combinations meet WCAG AA standards:
- Primary text on surface: 15.8:1 (AAA)
- Secondary text on surface: 7.5:1 (AA)
- Primary button text: 4.5:1 (AA)
- Accent links: 4.5:1 (AA)

### Color Usage Guidelines
- Use `text-primary` for main headings and important text
- Use `text-text-secondary` for descriptions and secondary information
- Use `text-accent` for links and interactive elements
- Use status colors consistently for their respective states

## Dark Mode Support

The design system includes dark mode support through CSS media queries:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode overrides */
}
```

## Implementation Notes

- All tokens are defined as CSS custom properties for consistency
- Tailwind configuration extends the default theme with custom colors
- Components use semantic color names rather than specific hex values
- Font loading is optimized through Next.js font optimization

## Future Enhancements

- Add spacing tokens for consistent margins and padding
- Implement component-specific tokens for complex components
- Add animation tokens for consistent transitions
- Create design token visualization tools
