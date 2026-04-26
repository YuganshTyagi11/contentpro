# AI Image Generation Pipeline

This project provides a generic pipeline for generating high-quality AI images using reference images and a specialized prompt system.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   ```

2. **Install dependencies:**
   It is recommended to use a virtual environment.
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

The `image_gen.py` script is designed to be flexible and configurable via command-line arguments.

### Arguments:
- `--image_dir`: (Required) Path to the directory containing your reference images (supported formats: .jpg, .jpeg, .png, .webp).
- `--output_dir`: (Optional) Path to the directory where generated images will be saved. Defaults to `output`.
- `--n`: (Optional) Number of images to generate. This also determines how many shot prompts from `shot_prompts.json` are appended to the base prompt. Defaults to `1`.

### Running the script:
```bash
python image_gen.py --image_dir ./my_reference_images --output_dir ./results --n 5
```

## How it Works
1. **Base Prompt:** The script reads the core instructions from `base_prompt.txt`.
2. **Shot Prompts:** It loads variation descriptions from `shot_prompts.json`.
3. **Dynamic Prompting:** Based on the value of `n`, it appends the first `n` shot prompts to the base prompt to guide the AI in generating diverse variations.
4. **Reference Images:** Up to 4 reference images from the specified `--image_dir` are used as input for the model. If more than 4 images are present, only the first 4 (sorted alphabetically) will be used.
5. **Generation:** It calls the `gpt-image-1.5` model to generate the images and saves them to the specified `--output_dir`.
