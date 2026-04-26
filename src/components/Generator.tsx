import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, Sparkles, Download, X } from "lucide-react";
import { toast } from "sonner";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
const MODEL = "gpt-image-1";
type ShotPrompt = { key?: string; prompt?: string };
type GeneratedOutputs = {
  lifestyle: string | null;
  inUse: string | null;
};

const readTextFile = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.text();
};

const getPromptByKey = async (promptKey: string, fallbackPrompt: string) => {
  const [basePromptText, shotPromptsText] = await Promise.all([
    readTextFile("/base_prompt.txt"),
    readTextFile("/shot_prompts.json"),
  ]);

  const parsedShots = JSON.parse(shotPromptsText) as ShotPrompt[];
  const matchedPrompt = parsedShots.find((shot) => shot.key === promptKey)?.prompt ?? fallbackPrompt;

  return `${basePromptText.trim()}\n\n### VISUAL VARIATION:\n${matchedPrompt}`;
};

export const Generator = () => {
  const [brandName, setBrandName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [productName, setProductName] = useState("");
  const [industry, setIndustry] = useState("bags-accessories");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedOutputs>({ lifestyle: null, inUse: null });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiKey = useMemo(() => import.meta.env.VITE_OPENAI_API_KEY?.trim() ?? "", []);

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResults({ lifestyle: null, inUse: null });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!ACCEPT.split(",").includes(f.type)) {
      toast.error("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResults({ lifestyle: null, inUse: null });
  };

  const allFilled = brandName && brandWebsite && productName && industry && file;

  const handleGenerate = async () => {
    if (!allFilled) {
      toast.error("Please fill in every field and upload a product image.");
      return;
    }

    if (!apiKey) {
      toast.error("Missing API key. Add VITE_OPENAI_API_KEY in your local .env file.");
      return;
    }

    setLoading(true);
    setDialogOpen(true);
    setResults({ lifestyle: null, inUse: null });

    const generateImage = async (prompt: string) => {
      const formData = new FormData();
      formData.append("model", MODEL);
      formData.append("prompt", prompt);
      formData.append("size", "1024x1024");
      formData.append("quality", "low");
      formData.append("n", "1");
      formData.append("image", file as Blob, file?.name ?? "product.png");

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Generation request failed.");
      }

      const data = await response.json() as { data?: Array<{ b64_json?: string; url?: string }> };
      const output = data?.data?.[0];

      if (!output) {
        throw new Error("No image was returned by the API.");
      }

      if (output.b64_json) return `data:image/png;base64,${output.b64_json}`;
      if (output.url) return output.url;

      throw new Error("Unexpected API response.");
    };

    try {
      const [lifestyleTemplate, inUseTemplate] = await Promise.all([
        getPromptByKey("lifestyle", "Create a premium lifestyle composition with realistic props."),
        getPromptByKey("in_use", "Create a natural in-use shot with the product worn or actively used."),
      ]);

      const baseContext = [
        `Brand Name: ${brandName}`,
        `Brand Website: ${brandWebsite}`,
        `Product Name: ${productName}`,
        "Industry: Bags & Accessories",
      ].join("\n");

      const lifestylePrompt = `${lifestyleTemplate}\n${baseContext}\nGenerate only one final lifestyle image.`;
      const inUsePrompt = `${inUseTemplate}\n${baseContext}\nGenerate only one final in-use image.`;

      const [lifestyle, inUse] = await Promise.all([
        generateImage(lifestylePrompt),
        generateImage(inUsePrompt),
      ]);

      setResults({ lifestyle, inUse });
      toast.success("Both lifestyle and in-use images are ready!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Generation failed.";
      toast.error(message);
      setDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="generate" className="py-16 border-t border-border/60">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Generate</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Create your <span className="text-gold">lifestyle shot</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fill in the details, upload a clean product photo, and let Content Pro do the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="surface-1 rounded-2xl border border-border/60 p-6 md:p-8 shadow-card">
            <div className="grid gap-4">
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
                  className="border-2 border-dashed border-border hover:border-gold rounded-xl p-5 text-left transition-colors flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{file ? file.name : "Click to upload"}</div>
                    <div className="text-xs text-muted-foreground">JPG, PNG or WEBP — all formats supported</div>
                  </div>
                </button>

                {preview && (
                  <div className="relative rounded-xl overflow-hidden border border-border/60 h-36 w-full">
                    <img src={preview} alt="Uploaded product preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/85 border border-border flex items-center justify-center hover:border-gold"
                      aria-label="Remove uploaded image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

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

          <div className="surface-1 rounded-2xl border border-border/60 p-6 md:p-8 shadow-card flex flex-col">
            <div className="text-sm text-muted-foreground mb-4">Final outputs</div>
            <div className="grid gap-4">
              <div className="rounded-xl border border-border/60 bg-background/40 overflow-hidden min-h-[220px] flex items-center justify-center">
                {results.lifestyle ? (
                  <img src={results.lifestyle} alt="Generated lifestyle" className="w-full h-full object-cover" />
                ) : preview ? (
                  <img src={preview} alt="Uploaded product" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="text-center px-6">
                    <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">Lifestyle image will appear here.</p>
                  </div>
                )}
              </div>
              {results.lifestyle && (
                <Button asChild variant="outline" className="border-gold">
                  <a href={results.lifestyle} download={`contentpro-${productName || "product"}-lifestyle.png`}>
                    <Download className="mr-2 h-4 w-4" /> Download Lifestyle
                  </a>
                </Button>
              )}

              <div className="rounded-xl border border-border/60 bg-background/40 overflow-hidden min-h-[220px] flex items-center justify-center">
                {results.inUse ? (
                  <img src={results.inUse} alt="Generated in-use" className="w-full h-full object-cover" />
                ) : preview ? (
                  <img src={preview} alt="Uploaded product" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="text-center px-6">
                    <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className="text-muted-foreground">In-use image will appear here.</p>
                  </div>
                )}
              </div>
              {results.inUse && (
                <Button asChild variant="outline" className="border-gold">
                  <a href={results.inUse} download={`contentpro-${productName || "product"}-in-use.png`}>
                    <Download className="mr-2 h-4 w-4" /> Download In-Use
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => !loading && setDialogOpen(open)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generating lifestyle image</DialogTitle>
            <DialogDescription>
              {loading
                ? "Please wait while we render your one final image."
                : "Generation completed. Your image is ready below."}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-border/60 min-h-[320px] overflow-hidden flex items-center justify-center bg-background/50">
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Crafting your lifestyle and in-use shots…</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3 w-full p-3">
                <div className="rounded-lg overflow-hidden border border-border/60 bg-background/40 min-h-[220px] flex items-center justify-center">
                  {results.lifestyle ? (
                    <img src={results.lifestyle} alt="Generated lifestyle output" className="h-full w-full object-cover" />
                  ) : (
                    <p className="text-sm text-muted-foreground">Lifestyle image not ready.</p>
                  )}
                </div>
                <div className="rounded-lg overflow-hidden border border-border/60 bg-background/40 min-h-[220px] flex items-center justify-center">
                  {results.inUse ? (
                    <img src={results.inUse} alt="Generated in-use output" className="h-full w-full object-cover" />
                  ) : (
                    <p className="text-sm text-muted-foreground">In-use image not ready.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {!loading && (results.lifestyle || results.inUse) && (
            <div className="grid sm:grid-cols-2 gap-2">
              {results.lifestyle && (
                <Button asChild className="bg-gold text-primary-foreground hover:opacity-90">
                  <a href={results.lifestyle} download={`contentpro-${productName || "product"}-lifestyle.png`}>
                    <Download className="mr-2 h-4 w-4" /> Download Lifestyle
                  </a>
                </Button>
              )}
              {results.inUse && (
                <Button asChild className="bg-gold text-primary-foreground hover:opacity-90">
                  <a href={results.inUse} download={`contentpro-${productName || "product"}-in-use.png`}>
                    <Download className="mr-2 h-4 w-4" /> Download In-Use
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
