import { InferenceClient } from '@huggingface/inference';


export async function genImg(model="dummy", prompt: string, img?: string) {
    /**
     * Returns a URL to a generated image based on the specified model and prompt.
    */
   console.log("Generating image with model:", model, "and prompt:", prompt);
   if (model == "dummy") {
    return 'https://ideas.darden.virginia.edu/sites/default/files/styles/full_width_1024px_5_3_/public/2024-09/AI%20ART%20ITA.jpg?itok=CIaF2iIX'
   } else if (model == "dall-e-3" || model == "dall-e-2" || model == "gpt-image-1") {
        console.log("Using OpenAI API for image generation");
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: model,
                prompt: prompt ?? 'A cute baby sea otter',
                n: 1,
                size: "1024x1024"
            })
        });
        const result = await response.json();
        return result.data[0].url;
   } else if (model == "stable-diffusion-xl-1.0" || model == "stable-diffusion-2" || model == "Qwen-Image-Edit") {
        var model_full_name = "";
        if (model == "stable-diffusion-xl-1.0") {
            model_full_name = "stabilityai/stable-diffusion-xl-1.0"
        } else if (model == "stable-diffusion-2") {
            model_full_name = "stabilityai/stable-diffusion-2-base"
        } else if (model == "Qwen-Image-Edit") {
            model_full_name = "Qwen/Qwen-Image-Edit"
        }
        const hf = new InferenceClient(import.meta.env.VITE_HUGGING_KEY);
        var blob = "";
        if (model == "Qwen-Image-Edit") {
            console.log("Fetching old image for editing")
            let oldImg = await fetch(img).then(r => r.blob());
            console.log("Using HuggingFace API for image editing");
            blob = URL.createObjectURL(await hf.imageToImage({
	provider: "fal-ai",
	model: "Qwen/Qwen-Image-Edit",
	inputs: oldImg,
	parameters: { prompt: "Turn the cat into a tiger.", },
}));
        } else {
            console.log("Using HuggingFace API for image generation");
            blob = await hf.textToImage({
            inputs:
                prompt ?? 'A happy puppy in a jungle' + " <lora:iu_V35:0.5> <lora:epiNoiseoffset_v2:0.5>",
            parameters: {
                negative_prompt: "easynegative",
            },
            model: model_full_name,});
        }
        return blob; // URL.createObjectURL(blob);
    }
}