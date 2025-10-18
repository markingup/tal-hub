import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Development Section Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display development documentation
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function DevelopmentSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Guide</CardTitle>
        <CardDescription>
          Setup, testing, and contribution guidelines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Environment Setup</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Required Environment Variables</h4>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                <div>NEXT_PUBLIC_APP_URL=http://localhost:3000</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Supabase Setup</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create new Supabase project</li>
                <li>Run SQL migrations from docs/Supabase_Setup_Engineering_Notes_mvp.md</li>
                <li>Configure RLS policies</li>
                <li>Set up storage bucket &apos;talhub-docs&apos;</li>
                <li>Enable email authentication</li>
                <li>Configure magic link settings</li>
              </ol>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Testing</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Unit Tests</h4>
                <div className="text-xs text-muted-foreground">
                  Jest + Testing Library for component testing
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Mock Data</h4>
                <div className="text-xs text-muted-foreground">
                  Pre-populated test users and cases
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">RLS Testing</h4>
                <div className="text-xs text-muted-foreground">
                  Verify access control with multiple users
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">E2E Testing</h4>
                <div className="text-xs text-muted-foreground">
                  Full user workflows and integrations
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Code Quality</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Linting & Formatting</h4>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                <div>npm run lint          # ESLint check</div>
                <div>npm run lint:fix      # Auto-fix issues</div>
                <div>npm run type-check    # TypeScript check</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Development Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Follow UNIX principles in all code</li>
                <li>• Keep components small and focused</li>
                <li>• Use TypeScript strict mode</li>
                <li>• Prefer composition over inheritance</li>
                <li>• Write clear, self-documenting code</li>
                <li>• Fail fast with helpful error messages</li>
                <li>• Test RLS policies thoroughly</li>
                <li>• Use React Query for all data fetching</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Project Structure</h3>
          <div className="bg-muted p-4 rounded-md text-sm font-mono">
            <div>src/</div>
            <div>├── app/                    # Next.js App Router</div>
            <div>│   ├── auth/              # Authentication pages</div>
            <div>│   ├── dashboard/          # Main application</div>
            <div>│   ├── docs/              # Documentation</div>
            <div>│   └── help/              # User help</div>
            <div>├── components/             # Reusable components</div>
            <div>│   ├── ui/                # Base UI components</div>
            <div>│   └── *.tsx              # Feature components</div>
            <div>├── lib/                   # Utilities & config</div>
            <div>│   ├── actions/           # Server actions</div>
            <div>│   ├── hooks/             # Custom hooks</div>
            <div>│   └── supabase/          # Supabase config</div>
            <div>└── docs/                  # Documentation</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
