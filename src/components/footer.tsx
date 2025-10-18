import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </a>
            . Following UNIX principles for clean, modular code.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link 
            href="/docs" 
            className="hover:text-foreground transition-colors underline underline-offset-4"
          >
            Docs
          </Link>
          <Link 
            href="/help" 
            className="hover:text-foreground transition-colors underline underline-offset-4"
          >
            Help
          </Link>
          <Link 
            href="/terms" 
            className="hover:text-foreground transition-colors underline underline-offset-4"
          >
            Terms
          </Link>
          <Link 
            href="/privacy" 
            className="hover:text-foreground transition-colors underline underline-offset-4"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
