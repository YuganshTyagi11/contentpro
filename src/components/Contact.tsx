import { Mail, Phone, User } from "lucide-react";

const team = [
  { name: "Yugansh Tyagi", phone: "+91 94574 44977" },
  { name: "Shivam Sharma", phone: "+91 80779 75497" },
];

export const Contact = () => (
  <section id="contact" className="py-16 border-t border-border/60">
    <div className="container max-w-5xl">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Contact</p>
        <h2 className="text-4xl md:text-5xl font-bold">Let's <span className="text-gold">work together</span></h2>
        <p className="text-muted-foreground mt-4">Reach out — we'd love to elevate your brand.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {team.map((m) => (
          <div key={m.name} className="surface-1 rounded-2xl border border-border/60 p-6 flex items-center gap-4 hover:border-gold transition-colors">
            <div className="h-14 w-14 rounded-full bg-gold flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="font-serif text-xl font-semibold">{m.name}</div>
              <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm mt-1">
                <Phone className="h-3.5 w-3.5" /> {m.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      <a
        href="mailto:yuganshtyagi11@gmail.com"
        className="surface-2 rounded-2xl border border-gold p-6 flex items-center gap-4 hover:glow-gold transition-shadow"
      >
        <div className="h-14 w-14 rounded-full bg-gold flex items-center justify-center shrink-0">
          <Mail className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Email us</div>
          <div className="font-serif text-xl font-semibold">yuganshtyagi11@gmail.com</div>
        </div>
      </a>
    </div>
  </section>
);
