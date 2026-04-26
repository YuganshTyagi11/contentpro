import logo from "@/assets/logo.png";

export const Logo = ({ className = "" }: { className?: string }) => (
  <a href="#top" className={`flex items-center gap-2 ${className}`}>
    <img src={logo} alt="Content Pro logo" width={40} height={40} className="h-10 w-10" />
    <span className="font-serif text-xl font-semibold tracking-tight">
      Content<span className="text-gold">Pro</span>
    </span>
  </a>
);
