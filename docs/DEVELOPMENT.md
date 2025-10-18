# Development Guide

This document provides comprehensive guidance for developers working on TALHub.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Codebase Architecture](#codebase-architecture)
3. [Component Guidelines](#component-guidelines)
4. [Database Patterns](#database-patterns)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites

- Node.js 18+ (recommended: use nvm)
- npm or yarn
- Git
- Supabase CLI (optional but recommended)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd tal-hub
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Supabase Setup**
   - Create a new Supabase project
   - Run the SQL migrations from `docs/Supabase_Setup_Engineering_Notes_mvp.md`
   - Set up RLS policies
   - Configure storage bucket `talhub-docs`

4. **Start Development Server**
   ```bash
   npm run dev
   ```

### IDE Configuration

Recommended VS Code extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

## Codebase Architecture

### Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── dashboard/        # Protected dashboard routes
│   ├── help/             # Help and support pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── auth-provider.tsx # Auth context
│   ├── case-*.tsx        # Case-related components
│   ├── document-*.tsx    # Document components
│   ├── message-*.tsx     # Messaging components
│   └── deadline-*.tsx    # Deadline components
├── lib/                   # Utilities and configurations
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom React hooks
│   ├── supabase/         # Supabase configuration
│   └── utils.ts          # Utility functions
└── docs/                 # Documentation
```

### Key Architectural Decisions

1. **App Router**: Using Next.js 15 App Router for modern routing
2. **Server Actions**: Prefer server actions over API routes for mutations
3. **React Query**: All data fetching goes through React Query
4. **RLS-First**: Database security enforced at the database level
5. **Component Composition**: Small, focused components that compose well

## Component Guidelines

### Component Structure

```tsx
// Component file: components/example-component.tsx
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

interface ExampleComponentProps extends ComponentProps<'div'> {
  title: string
  variant?: 'default' | 'secondary'
}

export function ExampleComponent({ 
  title, 
  variant = 'default', 
  className, 
  ...props 
}: ExampleComponentProps) {
  return (
    <div 
      className={cn(
        'base-styles',
        variant === 'secondary' && 'secondary-styles',
        className
      )}
      {...props}
    >
      <h2>{title}</h2>
    </div>
  )
}
```

### Component Guidelines

1. **Single Responsibility**: Each component should do one thing well
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Composition**: Prefer composition over inheritance
4. **Accessibility**: Use semantic HTML and ARIA attributes
5. **Styling**: Use Tailwind classes with `cn()` utility for conditional styling
6. **Error Boundaries**: Wrap components that might fail

### Custom Hooks

```tsx
// Hook file: lib/hooks/use-example.ts
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

export function useExample(id: string) {
  const [localState, setLocalState] = useState(null)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['example', id],
    queryFn: () => fetchExample(id),
    enabled: !!id
  })

  useEffect(() => {
    if (data) {
      setLocalState(data)
    }
  }, [data])

  return {
    data: localState,
    isLoading,
    error,
    setLocalState
  }
}
```

## Database Patterns

### Row Level Security (RLS)

All database access is controlled by RLS policies. Key patterns:

1. **Case Access**: Users can only access cases where they&apos;re participants
2. **Document Access**: Documents are only visible to case participants
3. **Message Access**: Messages are only visible to case participants
4. **Admin Override**: Admin users can access all data

### Server Actions

```tsx
// Server action file: lib/actions/example.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createExample(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('examples')
    .insert({
      title: formData.get('title'),
      user_id: user.id
    })

  if (error) throw error
  
  revalidatePath('/dashboard')
  return { success: true }
}
```

### React Query Integration

```tsx
// Hook with React Query: lib/hooks/use-examples.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createExample } from '@/lib/actions/example'

export function useExamples() {
  return useQuery({
    queryKey: ['examples'],
    queryFn: async () => {
      const supabase = createClient()
      const { data } = await supabase.from('examples').select('*')
      return data
    }
  })
}

export function useCreateExample() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples'] })
    }
  })
}
```

## Testing Strategy

### Testing Levels

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows
4. **RLS Tests**: Verify database security policies

### Testing Setup

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### Example Test

```tsx
// __tests__/components/example-component.test.tsx
import { render, screen } from '@testing-library/react'
import { ExampleComponent } from '@/components/example-component'

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(<ExampleComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})
```

## Deployment Process

### Pre-deployment Checklist

- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies tested
- [ ] Build succeeds locally

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. **Deploy**
   - Push to main branch triggers deployment
   - Monitor deployment logs
   - Test production environment

### Database Migrations

```sql
-- Migration file: supabase/migrations/001_example.sql
CREATE TABLE IF NOT EXISTS examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE examples ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own examples" ON examples
  FOR SELECT USING (auth.uid() = user_id);
```

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check user authentication status
   - Verify case participation
   - Test policies in Supabase dashboard

2. **Build Errors**
   - Check TypeScript errors
   - Verify environment variables
   - Clear Next.js cache

3. **Runtime Errors**
   - Check browser console
   - Verify Supabase connection
   - Check network requests

### Debug Tools

- **React Query Devtools**: Available in development
- **Supabase Dashboard**: Database and auth debugging
- **Next.js Devtools**: Performance and debugging
- **Browser DevTools**: Network and console debugging

### Performance Optimization

1. **Database Queries**
   - Use indexes for common queries
   - Implement pagination for large datasets
   - Optimize RLS policies

2. **React Components**
   - Use React.memo for expensive components
   - Implement proper loading states
   - Optimize re-renders with useMemo/useCallback

3. **Bundle Size**
   - Use dynamic imports for large components
   - Optimize images and assets
   - Monitor bundle size with Next.js analyzer

## Contributing

### Code Review Checklist

- [ ] Follows UNIX principles
- [ ] TypeScript types are correct
- [ ] Components are properly tested
- [ ] RLS policies are secure
- [ ] Performance is acceptable
- [ ] Accessibility standards met

### Git Workflow

1. Create feature branch from main
2. Make small, focused commits
3. Write descriptive commit messages
4. Test changes thoroughly
5. Submit pull request with description
6. Address review feedback
7. Merge after approval

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
