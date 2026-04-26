import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="border-t border-border/60 py-10">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <Logo />
      <p>© {new Date().getFullYear()} Content Pro. Crafted for premium brands.</p>
    </div>
  </footer>
);
