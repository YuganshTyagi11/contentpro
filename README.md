# Content Pro — Bags & Accessories Lifestyle Image Generator

This project now includes a working frontend generator flow for **one lifestyle output image** per request.

## What was added

- Reduced spacing between page sections for a tighter layout.
- Upload preview now includes a **close (X)** action to remove the selected image.
- Clicking **Generate Now** opens a generation dialog window.
- After generation, the generated lifestyle image is shown in the dialog and main preview.
- Download button is available for the final generated image.
- Prompt files (`base_prompt.txt` and `shot_prompts.json`) are mapped to frontend and loaded during generation.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a local `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your key in `.env` (do not commit `.env`):
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Generation behavior

- Endpoint used: `POST https://api.openai.com/v1/images/edits`
- Model: `gpt-image-1`
- Output count: exactly `1`
- Quality: `low` (for lower cost)
- Size: `1024x1024`

## Important note

This implementation uses a `VITE_` environment variable, so the key is available in the browser at runtime. For production, move image generation to a secure backend API.
