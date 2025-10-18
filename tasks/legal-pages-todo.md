# Legal Pages Implementation Plan

## Overview
Add required legal pages following UNIX principles:
- Single responsibility: Each page handles one specific legal document
- Work together: Pages compose cleanly via shared layout and components
- Simple over complex: Clean, focused implementations
- Text as interface: Clear, readable legal content

## Implementation Tasks

### 1. Terms of Service Page ✅
- [ ] Create `/terms` route
- [ ] Add Terms of Service content
- [ ] Ensure proper legal language
- [ ] Add "Not legal advice" disclaimer

### 2. Privacy Policy Page ✅
- [ ] Create `/privacy` route
- [ ] Add Privacy Policy content
- [ ] Include data collection, usage, and sharing policies
- [ ] Add cookie policy section

### 3. Footer Updates ✅
- [ ] Add links to legal pages in footer
- [ ] Maintain responsive design
- [ ] Follow existing footer pattern

### 4. Cookie Consent Banner ✅
- [ ] Create cookie consent banner component
- [ ] Add to root layout
- [ ] Include accept/decline functionality
- [ ] Store consent preference

### 5. Legal Disclaimer Component ✅
- [ ] Create reusable disclaimer component
- [ ] Add to relevant pages (dashboard, cases, etc.)
- [ ] Ensure prominent placement

## Technical Implementation Details

### Page Structure Pattern
```tsx
// Consistent legal page pattern
export default function LegalPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">[Page Title]</h1>
      <div className="prose prose-gray max-w-none">
        {/* Legal content */}
      </div>
      <LegalDisclaimer />
    </div>
  )
}
```

### Footer Links Pattern
```tsx
// Footer with legal links
<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
  <div className="flex gap-4 text-sm text-muted-foreground">
    <Link href="/terms">Terms</Link>
    <Link href="/privacy">Privacy</Link>
  </div>
  {/* Existing content */}
</div>
```

### Cookie Banner Pattern
```tsx
// Cookie consent banner
export function CookieBanner() {
  const [show, setShow] = useState(true)
  
  if (!show) return null
  
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm mb-3">
            We use cookies to improve your experience.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAccept}>Accept</Button>
            <Button size="sm" variant="outline" onClick={handleDecline}>Decline</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Files to Create/Modify

### New Files
- `src/app/terms/page.tsx` - Terms of Service page
- `src/app/privacy/page.tsx` - Privacy Policy page
- `src/components/cookie-banner.tsx` - Cookie consent banner
- `src/components/legal-disclaimer.tsx` - Reusable disclaimer component

### Modified Files
- `src/components/footer.tsx` - Add legal page links
- `src/app/layout.tsx` - Add cookie banner

## Success Criteria
- [ ] Terms of Service page accessible at `/terms`
- [ ] Privacy Policy page accessible at `/privacy`
- [ ] Footer contains links to legal pages
- [ ] Cookie consent banner appears on first visit
- [ ] Legal disclaimer appears on relevant pages
- [ ] All pages follow responsive design
- [ ] No linting errors
- [ ] TypeScript type safety maintained

## UNIX Principles Applied
1. **Do One Thing Well**: Each component handles one specific legal function
2. **Work Together**: Components compose cleanly via shared layout
3. **Text as Interface**: Clear, readable legal content
4. **KISS**: Simple, focused implementations
5. **Rule of Silence**: Quiet success, informative errors
6. **Rule of Repair**: Fail fast with clear recovery options
