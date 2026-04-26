import s1 from "@/assets/sample-1.png";
import s2 from "@/assets/sample-2.png";
import s3 from "@/assets/sample-3.png";
import s4 from "@/assets/sample-4.png";
import s5 from "@/assets/sample-5.png";

const images = [s1, s2, s3, s4, s5];

export const SampleSlider = () => {
  const loop = [...images, ...images];
  return (
    <section id="samples" className="py-16 border-t border-border/60">
      <div className="container text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Gallery</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Crafted by <span className="text-gold">Content Pro</span></h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Real lifestyle imagery generated for premium bags & accessories brands.
        </p>
      </div>

      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-6 w-max animate-marquee">
          {loop.map((src, i) => (
            <div
              key={i}
              className="w-[340px] md:w-[420px] aspect-[3/2] rounded-2xl overflow-hidden shadow-card border border-border/60 shrink-0 group"
            >
              <img
                src={src}
                alt={`Lifestyle bag sample ${(i % images.length) + 1}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
