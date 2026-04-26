import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => (
  <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
    <nav className="container flex h-16 items-center justify-between">
      <Logo />
      <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
        <a href="#samples" className="hover:text-foreground transition-colors">Samples</a>
        <a href="#generate" className="hover:text-foreground transition-colors">Generate</a>
        <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
      </div>
      <Button asChild className="bg-gold text-primary-foreground hover:opacity-90 font-medium">
        <a href="#generate">Try Now</a>
      </Button>
    </nav>
  </header>
);
