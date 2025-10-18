import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Deployment Section Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display deployment documentation
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function DeploymentSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Guide</CardTitle>
        <CardDescription>
          Production deployment and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Vercel Deployment (Recommended)</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Setup Steps</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Connect GitHub repository to Vercel</li>
                <li>Set environment variables in Vercel dashboard</li>
                <li>Configure build settings (Next.js 15)</li>
                <li>Enable automatic deployments on push to main</li>
                <li>Set up custom domain (optional)</li>
              </ol>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Environment Variables</h4>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
                <div>NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Alternative Platforms</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Netlify</h4>
                <div className="text-xs text-muted-foreground">
                  Static site generation with edge functions
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">Railway</h4>
                <div className="text-xs text-muted-foreground">
                  Full-stack deployment with database
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">DigitalOcean</h4>
                <div className="text-xs text-muted-foreground">
                  App Platform with managed services
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">AWS Amplify</h4>
                <div className="text-xs text-muted-foreground">
                  AWS-native deployment and hosting
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Production Checklist</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Security</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Enable HTTPS/SSL certificates</li>
                <li>✓ Configure CORS policies</li>
                <li>✓ Set up rate limiting</li>
                <li>✓ Enable Supabase RLS policies</li>
                <li>✓ Configure secure headers</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Performance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Enable CDN for static assets</li>
                <li>✓ Configure image optimization</li>
                <li>✓ Set up caching strategies</li>
                <li>✓ Monitor Core Web Vitals</li>
                <li>✓ Optimize database queries</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Monitoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Set up error tracking (Sentry)</li>
                <li>✓ Configure uptime monitoring</li>
                <li>✓ Monitor Supabase usage</li>
                <li>✓ Set up log aggregation</li>
                <li>✓ Configure alerts and notifications</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Build Commands</h3>
          <div className="bg-muted p-4 rounded-md text-sm font-mono">
            <div># Development</div>
            <div>npm run dev</div>
            <div></div>
            <div># Production build</div>
            <div>npm run build</div>
            <div>npm run start</div>
            <div></div>
            <div># Testing</div>
            <div>npm run test</div>
            <div>npm run test:coverage</div>
            <div></div>
            <div># Code quality</div>
            <div>npm run lint</div>
            <div>npm run type-check</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
