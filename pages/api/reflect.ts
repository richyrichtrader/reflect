/pages
  /api
    reflect.js
/components
app code (React stuff)

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt } = req.body
  const apiKey = process.env.OPENAI_API_KEY

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // or 'gpt-4'
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.8,
      }),
    })

    const data = await completion.json()
    const reflection = data.choices?.[0]?.message?.content || 'No response.'

    res.status(200).json({ reflection })
  } catch (error) {
    console.error('Error generating reflection:', error)
    res.status(500).json({ reflection: 'An error occurred while reflecting.' })
  }
}
