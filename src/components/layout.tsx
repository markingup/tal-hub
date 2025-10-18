import { UniversalNavbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <UniversalNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
