import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import sample1 from "@/assets/sample-1.png";
import sample2 from "@/assets/sample-2.png";

export const Hero = () => (
  <section id="top" className="relative overflow-hidden">
    <div className="container py-14 md:py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold bg-secondary/50 text-xs uppercase tracking-widest text-muted-foreground mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Lifestyle Photography
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
          Editorial shots <br />
          for your <span className="text-gold">brand</span>.
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          Content Pro turns plain product photos into stunning lifestyle imagery —
          the kind that sells. Built for fashion, bags & accessories.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="bg-gold text-primary-foreground hover:opacity-90 font-medium glow-gold">
            <a href="#generate">Generate Now <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-gold">
            <a href="#samples">View Samples</a>
          </Button>
        </div>
        <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
          <div><div className="text-2xl font-serif text-foreground">10k+</div>shots delivered</div>
          <div className="h-10 w-px bg-border" />
          <div><div className="text-2xl font-serif text-foreground">4.9★</div>brand rating</div>
          <div className="h-10 w-px bg-border" />
          <div><div className="text-2xl font-serif text-foreground">30s</div>per render</div>
        </div>
      </div>

      <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,hsl(42_78%_50%/0.25),transparent_70%)]" />
        <div className="relative grid grid-cols-2 gap-4">
          <img
            src={sample1}
            alt="Lifestyle bag photography sample"
            className="rounded-2xl shadow-elegant animate-float"
            width={600}
            height={400}
          />
          <img
            src={sample2}
            alt="Editorial bag styling sample"
            className="rounded-2xl shadow-elegant animate-float mt-12"
            style={{ animationDelay: "1.5s" }}
            width={600}
            height={400}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
);
