import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload", desc: "Drop your raw product image — JPG, PNG or WEBP." },
  { icon: Wand2, title: "Describe", desc: "Tell us your brand, product and industry." },
  { icon: Download, title: "Generate", desc: "Receive an editorial lifestyle shot in seconds." },
];

export const HowItWorks = () => (
  <section id="how" className="py-24 border-t border-border/60">
    <div className="container">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Process</p>
        <h2 className="text-4xl md:text-5xl font-bold">Three steps. <span className="text-gold">Zero hassle.</span></h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div
            key={s.title}
            className="surface-1 rounded-2xl border border-border/60 p-8 hover:border-gold transition-colors group"
          >
            <div className="text-xs text-muted-foreground mb-6">0{i + 1}</div>
            <div className="h-14 w-14 rounded-xl bg-gold flex items-center justify-center mb-5 group-hover:glow-gold transition-shadow">
              <s.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
            <p className="text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
