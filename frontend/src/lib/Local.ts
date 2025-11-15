export async function generateImage(prompt?: string) {
    const id = await (await fetch('https://hack-mit-2025-chi.vercel.app/api/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'fast',
            prompt: prompt ?? 'The edge of the universe',
        })
    })).text();

    while(true) {
        const result = await fetch('https://hack-mit-2025-chi.vercel.app/api/access', {
            method: 'POST',
            body: id
        })

        if(result.status === 201) {
            await new Promise(res => setTimeout(res, 500))
            
            continue
        }

        const image = await (result).text();

        return 'data:image/png;base64, ' + image
    }
}