import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Database Section Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display database documentation
 * - Work together: Composes with Card components
 * - Simple over complex: Clean, focused content
 */
export function DatabaseSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Schema</CardTitle>
        <CardDescription>
          Complete database structure and relationships
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Core Tables</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">profiles</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• id (UUID, PK, FK → auth.users.id)</div>
                <div>• email (text)</div>
                <div>• role (enum: tenant, landlord, lawyer, admin)</div>
                <div>• full_name (text)</div>
                <div>• phone (text)</div>
                <div>• created_at (timestamp)</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">cases</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• id (UUID, PK)</div>
                <div>• title (text)</div>
                <div>• type (enum: non_payment, repossession, renovation, etc.)</div>
                <div>• status (enum: draft, active, closed, archived)</div>
                <div>• created_by (UUID, FK → profiles.id)</div>
                <div>• tal_dossier_number (text, optional)</div>
                <div>• opposing_party_name (text, optional)</div>
                <div>• next_hearing_date (date, optional)</div>
                <div>• notes (text, optional)</div>
                <div>• created_at (timestamp)</div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">case_participants</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• case_id (UUID, FK → cases.id)</div>
                <div>• user_id (UUID, FK → profiles.id)</div>
                <div>• role (enum: tenant, landlord, lawyer)</div>
                <div>• added_by (UUID, FK → profiles.id)</div>
                <div>• created_at (timestamp)</div>
                <div>• Composite PK: (case_id, user_id)</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Related Tables</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">documents</h4>
                <div className="text-xs text-muted-foreground">
                  File metadata, storage paths, case associations
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">messages</h4>
                <div className="text-xs text-muted-foreground">
                  Real-time messaging within cases
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">deadlines</h4>
                <div className="text-xs text-muted-foreground">
                  Task and deadline tracking
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">consultations</h4>
                <div className="text-xs text-muted-foreground">
                  Lawyer consultation requests (Phase 2)
                </div>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm">payments</h4>
                <div className="text-xs text-muted-foreground">
                  Payment tracking (Phase 2)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Row Level Security (RLS)</h3>
          <div className="bg-muted p-4 rounded-md text-sm">
            <div className="font-medium mb-2">Key RLS Policies:</div>
            <div>• Case access controlled via case_participants table</div>
            <div>• Users can only see cases they&apos;re participants in</div>
            <div>• Admin role bypasses all restrictions</div>
            <div>• Documents, messages, deadlines inherit case permissions</div>
            <div>• Profile data: users can only access their own profile</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Indexes</h3>
          <div className="bg-muted p-4 rounded-md text-sm font-mono">
            <div>-- Performance indexes</div>
            <div>CREATE INDEX idx_cp_user ON case_participants (user_id);</div>
            <div>CREATE INDEX idx_docs_case ON documents (case_id);</div>
            <div>CREATE INDEX idx_msgs_case_created ON messages (case_id, created_at DESC);</div>
            <div>CREATE INDEX idx_deadlines_case_due ON deadlines (case_id, due_date);</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
