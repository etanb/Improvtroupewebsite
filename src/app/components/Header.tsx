import { Instagram } from "lucide-react";

export function Header() {
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="border-b-4 border-primary bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-secondary px-4 py-2 border-4 border-primary transform -rotate-1">
            <span className="text-3xl font-bold tracking-tighter">LFW</span>
          </div>
          <span className="hidden sm:inline text-xl">Late For Work</span>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#shows" onClick={scrollTo("shows")} className="hover:text-destructive transition-colors">
            Shows
          </a>
          <a href="#contact" onClick={scrollTo("contact")} className="hover:text-destructive transition-colors">
            Contact
          </a>
          <div className="flex gap-3 ml-2">
            <a
              href="https://instagram.com/late.for.work.improv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-destructive transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
