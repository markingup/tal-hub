import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Architecture Section Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display architecture documentation
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function ArchitectureSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
        <CardDescription>
          High-level overview of TALHub&apos;s technical architecture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Frontend Stack</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Core Framework</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 15 with App Router</li>
                <li>• React 19 with Server Components</li>
                <li>• TypeScript with strict mode</li>
                <li>• Turbopack for fast builds</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">UI & Styling</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tailwind CSS for styling</li>
                <li>• Radix UI for components</li>
                <li>• Lucide React for icons</li>
                <li>• next-themes for dark mode</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">State Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React Query for server state</li>
                <li>• React Hook Form for forms</li>
                <li>• Zod for validation</li>
                <li>• Context API for client state</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">File Handling</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• react-dropzone for uploads</li>
                <li>• Supabase Storage for files</li>
                <li>• Signed URLs for access</li>
                <li>• File type validation</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Backend Services</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Supabase Services</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PostgreSQL database</li>
                <li>• Row Level Security (RLS)</li>
                <li>• Authentication & Authorization</li>
                <li>• Real-time subscriptions</li>
                <li>• File storage & CDN</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Security Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Magic link authentication</li>
                <li>• JWT token management</li>
                <li>• Role-based access control</li>
                <li>• Encrypted file storage</li>
                <li>• Rate limiting</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">UNIX Principles Applied</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Do One Thing Well</h4>
                <p className="text-xs text-muted-foreground">Each component has a single responsibility</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Work Together</h4>
                <p className="text-xs text-muted-foreground">Loose coupling via props and APIs</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Text as Interface</h4>
                <p className="text-xs text-muted-foreground">JSON APIs and configuration files</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">KISS</h4>
                <p className="text-xs text-muted-foreground">Simple solutions over complex ones</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Rule of Silence</h4>
                <p className="text-xs text-muted-foreground">Minimal logging, clear errors</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Rule of Repair</h4>
                <p className="text-xs text-muted-foreground">Fail fast with helpful information</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
