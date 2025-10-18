import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  Shield, 
  Users
} from 'lucide-react'

/**
 * Overview Section Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display overview documentation
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
            <CardDescription>
              Get up and running with TALHub in minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Prerequisites</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Node.js 18+</li>
                <li>• npm or yarn</li>
                <li>• Supabase account</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Installation</h4>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                <div>git clone &lt;repo-url&gt;</div>
                <div>cd tal-hub</div>
                <div>npm install</div>
                <div>cp env.example .env.local</div>
                <div>npm run dev</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Model
            </CardTitle>
            <CardDescription>
              Understanding TALHub&apos;s security architecture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">RLS</Badge>
                <span className="text-sm">Row-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">RBAC</Badge>
                <span className="text-sm">Role-Based Access Control</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">JWT</Badge>
                <span className="text-sm">JWT Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Signed URLs</Badge>
                <span className="text-sm">Secure File Access</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              All data access is controlled through Supabase RLS policies, ensuring users can only access cases they&apos;re participants in.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Roles & Permissions
          </CardTitle>
          <CardDescription>
            Understanding the role-based access system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Tenant</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create cases</li>
                <li>• Upload documents</li>
                <li>• Send messages</li>
                <li>• Manage deadlines</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Landlord</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create cases</li>
                <li>• Upload documents</li>
                <li>• Send messages</li>
                <li>• Manage deadlines</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Lawyer</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All tenant/landlord permissions</li>
                <li>• Provide consultations</li>
                <li>• Access payment system</li>
                <li>• Professional tools</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Admin</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All permissions</li>
                <li>• System administration</li>
                <li>• User management</li>
                <li>• Analytics access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
