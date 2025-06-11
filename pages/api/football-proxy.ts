import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url param' });
  }
  try {
    const apiRes = await fetch(url, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN || '9d9e06409f9745b2ab1c514986810209' }
    });
    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: String(err) });
  }
} 