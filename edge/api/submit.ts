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

  const { id, image } = req.body

  const completed: any[] = await redis.get('completed') ?? []
  completed.push({
    id,
    image
  })
  await redis.set('completed', completed)
    
  return res.send('OK')
}