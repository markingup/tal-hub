import { AlertTriangle } from "lucide-react";

export function LegalDisclaimer() {
  return (
    <div className="bg-yellow-50 border border-warning rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-warning mb-1">Legal Disclaimer</p>
          <p className="text-warning">
            The information provided on TALHub is for general informational purposes only and does not constitute legal advice. 
            Always consult with a qualified legal professional for advice specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}
