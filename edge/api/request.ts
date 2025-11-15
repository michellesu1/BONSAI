import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req: VercelRequest, res: VercelResponse) {  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { type, prompt } = req.body
  
  const id = Math.random().toString()

  const requests: any[] = await redis.get('requests') ?? []
  requests.push({
    id,
    type,
    prompt
  })
  await redis.set('requests', requests)

  return res.status(200).send(id)

  // const result = await fetch('http://localhost:25566')
  // const blob = await result.blob()

  // const buffer = Buffer.from(await blob.arrayBuffer())

  // console.log(await redis.get('prefs'))

  // res.setHeader('Content-Type', blob.type || 'image/png')
  // res.setHeader('Content-Length', buffer.length)
    
  // return res.send(buffer)
}