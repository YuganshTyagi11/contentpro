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

const readTextFile = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.text();
};

const getPrompt = async () => {
  const [basePromptText, shotPromptsText] = await Promise.all([
    readTextFile("/base_prompt.txt"),
    readTextFile("/shot_prompts.json"),
  ]);

  const parsedShots = JSON.parse(shotPromptsText) as Array<{ prompt?: string }>;
  const firstShot = parsedShots[0]?.prompt ?? "Create a single premium lifestyle product shot.";

  return `${basePromptText.trim()}\n\n### VISUAL VARIATION:\n${firstShot}`;
};

export const Generator = () => {
  const [brandName, setBrandName] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [productName, setProductName] = useState("");
  const [industry, setIndustry] = useState("bags-accessories");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiKey = useMemo(() => import.meta.env.VITE_OPENAI_API_KEY?.trim() ?? "", []);

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
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
    setResult(null);
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
    setResult(null);

    try {
      const promptTemplate = await getPrompt();
      const prompt = [
        promptTemplate,
        `Brand Name: ${brandName}`,
        `Brand Website: ${brandWebsite}`,
        `Product Name: ${productName}`,
        "Industry: Bags & Accessories",
        "Generate only one final lifestyle image.",
      ].join("\n");

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

      if (output.b64_json) {
        setResult(`data:image/png;base64,${output.b64_json}`);
      } else if (output.url) {
        setResult(output.url);
      } else {
        throw new Error("Unexpected API response.");
      }

      toast.success("Your lifestyle image is ready!");
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
            <div className="text-sm text-muted-foreground mb-4">Final output</div>
            <div className="flex-1 rounded-xl border border-border/60 bg-background/40 overflow-hidden min-h-[320px] flex items-center justify-center">
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
                <a href={result} download={`contentpro-${productName || "lifestyle"}.png`}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              </Button>
            )}
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
                <p className="text-sm">Crafting your lifestyle shot…</p>
              </div>
            ) : result ? (
              <img src={result} alt="Generated lifestyle output" className="h-full w-full object-cover" />
            ) : (
              <p className="text-sm text-muted-foreground">No image yet.</p>
            )}
          </div>

          {!loading && result && (
            <Button asChild className="bg-gold text-primary-foreground hover:opacity-90">
              <a href={result} download={`contentpro-${productName || "lifestyle"}.png`}>
                <Download className="mr-2 h-4 w-4" /> Download Image
              </a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
