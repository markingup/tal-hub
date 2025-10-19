import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Empty spacer */}
          <div className="flex items-center">
            {/* Empty to match header structure */}
          </div>

          {/* Center: Footer Links */}
          <div className="flex-1 flex justify-center">
            <div className="flex gap-4 text-sm text-text-secondary">
              <Link 
                href="/help" 
                className="hover:text-primary-hover transition-colors underline underline-offset-4"
              >
                Help
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-primary-hover transition-colors underline underline-offset-4"
              >
                Terms
              </Link>
              <Link 
                href="/privacy" 
                className="hover:text-primary-hover transition-colors underline underline-offset-4"
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Right: Empty spacer */}
          <div className="flex items-center">
            {/* Empty to match header structure */}
          </div>
        </div>
      </div>
    </footer>
  );
}
