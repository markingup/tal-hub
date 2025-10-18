/**
 * Cases Loading Component
 * 
 * Follows UNIX principles:
 * - Single responsibility: Display loading state for cases page
 * - Simple over complex: Clean loading animation
 * - Rule of silence: Minimal UI during loading
 */

export default function CasesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading cases...</p>
      </div>
    </div>
  )
}
