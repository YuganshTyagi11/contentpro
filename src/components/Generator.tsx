import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";

export const Generator = () => {
  const [brandName, setBrandName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [productName, setProductName] = useState("");
  const [industry, setIndustry] = useState("bags-accessories");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!ACCEPT.split(",").includes(f.type)) {
      toast.error("Please upload a JPG, PNG or WEBP image.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const allFilled = brandName && brandWebsite && productName && industry && file;

  const handleGenerate = async () => {
    if (!allFilled) {
      toast.error("Please fill in every field and upload a product image.");
      return;
    }
    setLoading(true);
    setResult(null);
    // Simulated generation — frontend-only build
    await new Promise((r) => setTimeout(r, 2200));
    setResult(preview);
    setLoading(false);
    toast.success("Your lifestyle image is ready!");
  };

  return (
    <section id="generate" className="py-24 border-t border-border/60">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Generate</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create your <span className="text-gold">lifestyle shot</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fill in the details, upload a clean product photo, and let Content Pro do the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="surface-1 rounded-2xl border border-border/60 p-6 md:p-8 shadow-card">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand name</Label>
                <Input id="brand" placeholder="e.g. Fossil" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Brand website</Label>
                <Input id="website" placeholder="https://yourbrand.com" value={brandWebsite} onChange={(e) => setBrandWebsite(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="product">Product name</Label>
                <Input id="product" placeholder="e.g. Carlie Mini Satchel" value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Product industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bags-accessories">Bags & Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Product raw image</Label>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-gold rounded-xl p-6 text-left transition-colors flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{file ? file.name : "Click to upload"}</div>
                    <div className="text-xs text-muted-foreground">JPG, PNG or WEBP — all formats supported</div>
                  </div>
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gold text-primary-foreground hover:opacity-90 font-medium glow-gold mt-2"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Now</>
                )}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="surface-1 rounded-2xl border border-border/60 p-6 md:p-8 shadow-card flex flex-col">
            <div className="text-sm text-muted-foreground mb-4">Preview</div>
            <div className="flex-1 rounded-xl border border-border/60 bg-background/40 overflow-hidden relative min-h-[360px] flex items-center justify-center">
              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Crafting your lifestyle shot…</p>
                </div>
              )}
              {result ? (
                <img src={result} alt="Generated lifestyle" className="w-full h-full object-cover" />
              ) : preview ? (
                <img src={preview} alt="Uploaded product" className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="text-center px-6">
                  <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                  <p className="text-muted-foreground">Your generated image will appear here.</p>
                </div>
              )}
            </div>
            {result && (
              <Button asChild variant="outline" className="mt-4 border-gold">
                <a href={result} download={`contentpro-${productName || "shot"}.png`}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
