# ContentPro Project Process Notes (College Documentation)

## 1) Project Objective
ContentPro is a **web application** that converts a raw product image into:
1. a **Lifestyle marketing image**, and
2. an **In-use marketing image**.

The user fills product details, uploads a product image, and the app sends prompts + image to the OpenAI Images API.

---

## 2) Languages and Core Technologies Used
- **TypeScript**: Main language for frontend logic.
- **React (TSX)**: UI library used to build reusable components.
- **Vite**: Build tool and development server.
- **Tailwind CSS**: Utility-first CSS styling.
- **Python**: Present in repo (`image_gen.py`) for related scripting workflows.

---

## 3) Frontend Architecture (High Level)
- `src/pages/Index.tsx` composes the landing page sections.
- `src/components/Generator.tsx` handles:
  - form inputs,
  - image upload and preview,
  - prompt building,
  - API requests,
  - output rendering and download buttons.
- Reusable UI primitives are in `src/components/ui/*` (buttons, dialog, select, etc.).

---

## 4) Main End-to-End Flow
1. User enters:
   - Brand name
   - Brand website
   - Product name
   - Industry
2. User uploads one raw product image (JPG/PNG/WEBP).
3. App loads prompt files from `public/`:
   - `base_prompt.txt`
   - `shot_prompts.json`
4. App selects two prompt variants:
   - `lifestyle`
   - `in_use`
5. App calls OpenAI Images Edit endpoint twice (parallel):
   - one request for lifestyle output,
   - one request for in-use output.
6. App renders both outputs in UI.
7. User can download both images independently.

---

## 5) Prompt and Model Strategy
- Model used: `gpt-image-1`
- Endpoint used: `POST https://api.openai.com/v1/images/edits`
- Inputs sent with `FormData`:
  - `model`
  - `prompt`
  - `size` (1024x1024)
  - `quality` (low)
  - `n` (1)
  - `image` (uploaded product)
- API key is read from Vite env variable: `VITE_OPENAI_API_KEY`

---

## 6) Dependencies Used
### Runtime dependencies (major)
- `react`, `react-dom`
- `react-router-dom`
- `@tanstack/react-query`
- `sonner` (toasts)
- `lucide-react` (icons)
- Many `@radix-ui/*` packages for accessible UI components
- Tailwind helpers: `clsx`, `tailwind-merge`

### Development dependencies (major)
- `vite`, `@vitejs/plugin-react-swc`
- `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `eslint`, `typescript-eslint`
- `vitest`, `@testing-library/react`, `jsdom`

> Exact full dependency lists are maintained in `package.json`.

---

## 7) Local Setup and Execution Steps
1. Install Node.js (LTS) and npm.
2. Clone repository.
3. Install packages:
   ```bash
   npm install
   ```
4. Create `.env` file (local only) and add:
   ```env
   VITE_OPENAI_API_KEY=your_api_key_here
   ```
5. Run development server:
   ```bash
   npm run dev
   ```
6. Build production bundle:
   ```bash
   npm run build
   ```
7. Run tests:
   ```bash
   npm run test
   ```
8. Run linter:
   ```bash
   npm run lint
   ```

---

## 8) Validation and Error Handling
- File type validation allows only JPG/JPEG/PNG/WEBP.
- Form fields are required before generation.
- Missing API key shows toast error.
- API non-200 responses are parsed and surfaced via toast.
- If API returns no output image, error is shown to user.

---

## 9) Feature Added in This Update
- Added generation of **two output types** in one action:
  1. Lifestyle image
  2. In-use image
- Added separate preview areas for both outputs.
- Added separate download buttons for each image.
- Updated generation dialog to display both outputs.

---

## 10) Future Improvements (Suggested)
- Add retry logic for one failed output while keeping the successful one.
- Add prompt customization UI (tone, lighting, background style).
- Add output history with timestamps.
- Add backend proxy to avoid exposing API key in frontend.
- Add automated visual regression tests.

