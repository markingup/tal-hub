import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * API Section Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display API documentation
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function ApiSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Reference</CardTitle>
        <CardDescription>
          Server actions, hooks, and Supabase integration patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Server Actions</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Document Actions</h4>
              <div className="bg-muted p-3 rounded-md text-sm font-mono">
                <div>// Upload document</div>
                <div>await uploadDocument(file, caseId)</div>
                <div></div>
                <div>// Get signed URL</div>
                <div>await getDocumentUrl(documentId)</div>
                <div></div>
                <div>// Delete document</div>
                <div>await deleteDocument(documentId)</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">React Hooks</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">useCases</h4>
                <p className="text-xs text-muted-foreground">Case management and CRUD operations</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">useDocuments</h4>
                <p className="text-xs text-muted-foreground">Document upload and management</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">useMessages</h4>
                <p className="text-xs text-muted-foreground">Real-time messaging functionality</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">useDeadlines</h4>
                <p className="text-xs text-muted-foreground">Deadline tracking and management</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">useCaseParticipants</h4>
                <p className="text-xs text-muted-foreground">Participant management and invitations</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">useAuth</h4>
                <p className="text-xs text-muted-foreground">Authentication state and user management</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Supabase Client Configuration</h3>
          <div className="bg-muted p-4 rounded-md text-sm font-mono">
            <div>// Client-side (browser)</div>
            <div>import &#123; createBrowserClient &#125; from &apos;@supabase/ssr&apos;</div>
            <div></div>
            <div>// Server-side (SSR)</div>
            <div>import &#123; createServerClient &#125; from &apos;@supabase/ssr&apos;</div>
            <div></div>
            <div>// Database types</div>
            <div>import type &#123; Database &#125; from &apos;@/lib/supabase/types&apos;</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Real-time Subscriptions</h3>
          <div className="bg-muted p-4 rounded-md text-sm font-mono">
            <div>// Subscribe to case messages</div>
            <div>const channel = supabase</div>
            <div>  .channel(`case-${caseId}`)</div>
            <div>  .on(&apos;postgres_changes&apos;, &#123;</div>
            <div>    event: &apos;INSERT&apos;,</div>
            <div>    schema: &apos;public&apos;,</div>
            <div>    table: &apos;messages&apos;,</div>
            <div>    filter: `case_id=eq.${caseId}`</div>
            <div>  &#125;, handleNewMessage)</div>
            <div>  .subscribe()</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
