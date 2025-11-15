export async function generateImage(prompt?: string) {
    const id = await (await fetch('http://127.0.0.1:3000/api/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'fast',
            prompt: 'testing prompt',
        })
    })).text();

    console.log(id)

    while(true) {
        const result = await fetch('http://127.0.0.1:3000/api/access', {
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

console.log(await generateImage('test'))