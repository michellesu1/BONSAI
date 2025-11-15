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
  
  const id = req.body

  const completed: any[] = await redis.get('completed') ?? []

  const result = completed.find(job => job.id === id)

  if(!result) return res.status(201).send('Not Ready Yet')

  completed.splice(completed.findIndex(job => job.id === id))

  await redis.set('completed', completed)

  res.setHeader('Content-Type','image/png')
    
  return res.status(200).send(result.image)
}