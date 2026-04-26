#!/usr/bin/env python3
import os
import base64
import json
import argparse
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def generate_images(image_dir, output_dir, n):
    pipeline_dir = Path(__file__).parent
    base_prompt_file = pipeline_dir / "base_prompt.txt"
    shot_prompts_file = pipeline_dir / "shot_prompts.json"
    
    image_folder = Path(image_dir)
    output_folder = Path(output_dir)
    output_folder.mkdir(parents=True, exist_ok=True)

    if not base_prompt_file.exists():
        print(f"Error: Base prompt file not found at {base_prompt_file}")
        return
    
    if not shot_prompts_file.exists():
        print(f"Error: Shot prompts file not found at {shot_prompts_file}")
        return

    with open(base_prompt_file, "r", encoding="utf-8") as f:
        base_prompt = f.read().strip()

    with open(shot_prompts_file, "r", encoding="utf-8") as f:
        shot_prompts_data = json.load(f)

    # Append shot prompts based on n
    selected_shots = shot_prompts_data[:n]
    shot_texts = "\n".join([shot["prompt"] for shot in selected_shots])
    
    full_prompt = f"{base_prompt}\n\n### VISUAL VARIATIONS AND SHOTS:\n{shot_texts}"

    # Gather reference images
    reference_images = []
    supported_exts = {".jpg", ".jpeg", ".png", ".webp"}
    
    if image_folder.exists():
        for img_path in sorted(image_folder.iterdir()):
            if img_path.suffix.lower() in supported_exts:
                if len(reference_images) < 4:
                    print(f"Loading reference image: {img_path.name}")
                    reference_images.append(img_path)
                else:
                    print(f"Skipping {img_path.name} (limit of 4 reached)")
    
    if not reference_images:
        print(f"Error: No reference images found in {image_folder}")
        return

    # Prepare API Client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not found in .env")
        return
    
    client = OpenAI(api_key=api_key)

    print(f"\nCalling gpt-image-1.5.edit with {len(reference_images)} reference image(s) to generate {n} images...")
    
    try:
        response = client.images.edit(
            image=reference_images,
            model="gpt-image-1.5",
            prompt=full_prompt,
            n=n,
            size="1024x1024",
            quality="high",
            input_fidelity="high",
        )

        for index, img_data in enumerate(response.data):
            if img_data.b64_json:
                filename = f"generated_{index+1}.png"
                file_path = output_folder / filename
                
                with open(file_path, "wb") as f:
                    f.write(base64.b64decode(img_data.b64_json))
                
                print(f"Saved: {file_path.resolve()}")
            elif img_data.url:
                print(f"Generated Image {index+1} URL: {img_data.url}")
            else:
                print(f"Warning: Image {index+1} had no data.")

    except Exception as e:
        print(f"API Call failed: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate AI images from reference images.")
    parser.add_argument("--image_dir", type=str, required=True, help="Directory containing reference images.")
    parser.add_argument("--output_dir", type=str, default="output", help="Directory to save generated images.")
    parser.add_argument("--n", type=int, default=1, help="Number of images to generate (and number of shot prompts to use).")
    
    args = parser.parse_args()
    generate_images(args.image_dir, args.output_dir, args.n)
