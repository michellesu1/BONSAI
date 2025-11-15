export async function generateImage(prompt?: string) {
    // return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-image-1',
                prompt: prompt ?? 'A cute baby sea otter',
                n: 1,
                size: "1024x1024"
            })
        });

        const result = await response.json();
        return 'data:image/png;base64, ' + result.data[0].b64_json;
}

export async function generateImageDalle3(prompt?: string) {
    // return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: prompt ?? 'A cute baby sea otter',
                n: 1,
                size: "1024x1024"
            })
        });

        const result = await response.json();

        return result.data[0].url;
}

export async function generateImageDalle2(prompt?: string) {
    // return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: 'dall-e-2',
                prompt: prompt ?? 'A cute baby sea otter',
                n: 1,
                size: "1024x1024"
            })
        });

        const result = await response.json();
        return result.data[0].url;
}

export async function modifyImageDalle3(image: string, prompt?: string) {
    // return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt ?? 'add A cute baby sea otter');
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch(image);

    const imageBlob = await response.blob();

    formData.append('image', imageBlob, 'image.png');

    const result = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: formData
    });

    const json = await result.json();

    return json.data[0].url;
}

export async function modifyImage(image: string, prompt?: string) {
    // return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt ?? 'add A cute baby sea otter');
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch(image);

    const imageBlob = await response.blob();

    formData.append('image', imageBlob, 'image.png');

    const result = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: formData
    })

    const json = await result.json()

    console.log(json)

    return 'data:image/png;base64, ' + json.data[0].b64_json
}


export async function mergeImages(images: string[], prompt?: string) {
    // return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQykzoZeCE0p7LeuyHnLYCdPP2jju9d5PaMeA&s'

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt ?? 'add A cute baby sea otter');
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    let index = 0
    for(const image of images) {
        const response = await fetch(image);

        const imageBlob = await response.blob();

        formData.append('image[]', imageBlob, `image${index}.png`);

        index++
    }

    const result = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_KEY}`
        },
        body: formData
    })

    const json = await result.json()

    console.log(json)

    return 'data:image/png;base64, ' + json.data[0].b64_json
}