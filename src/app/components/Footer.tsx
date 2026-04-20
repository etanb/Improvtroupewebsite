import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-4 border-primary bg-muted/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-secondary px-4 py-2 border-4 border-primary transform rotate-1">
              <span className="text-2xl font-bold tracking-tighter">LFW</span>
            </div>
            <div>
              <div className="font-bold">Late For Work</div>
              <div className="text-sm text-muted-foreground">Seattle Improv Comedy</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/late.for.work.improv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-destructive transition-colors"
            >
              <Instagram size={20} />
              <span>@late.for.work.improv</span>
            </a>
            <a
              href="mailto:hello@lateforwork.improv"
              className="flex items-center gap-2 hover:text-destructive transition-colors"
            >
              <Mail size={20} />
              <span>Email Us</span>
            </a>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          © 2026 Late For Work Improv. Stay silly!
        </div>
      </div>
    </footer>
  );
}
