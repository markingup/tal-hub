import { AlertTriangle } from "lucide-react";

export function LegalDisclaimer() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800 mb-1">Legal Disclaimer</p>
          <p className="text-yellow-700">
            The information provided on TALHub is for general informational purposes only and does not constitute legal advice. 
            Always consult with a qualified legal professional for advice specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}
