const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.vilao.ai/v1';
const AI_MODEL = process.env.AI_MODEL || 'occ/claude-haiku-4-5-20251001';
export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  if (!process.env.AI_API_KEY) return response.status(503).json({ error: 'AI service is not configured' });
  const { messages, max_tokens: maxTokens = 1024 } = request.body || {};
  if (!Array.isArray(messages) || !messages.length || messages.length > 12) return response.status(400).json({ error: 'Invalid messages' });
  const safeMessages = messages.map(({ role, content }) => ({ role: ['system','user','assistant'].includes(role) ? role : 'user', content: String(content || '').slice(0, 12000) }));
  try {
    const upstream = await fetch(`${AI_BASE_URL}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.AI_API_KEY}` }, body: JSON.stringify({ model: AI_MODEL, messages: safeMessages, max_tokens: Math.min(Number(maxTokens) || 1024, 1600), temperature: 0.7 }) });
    const data = await upstream.json().catch(() => ({ error: 'Invalid upstream response' }));
    return response.status(upstream.status).json(upstream.ok ? data : { error: data.error?.message || 'AI request failed' });
  } catch (error) {
    console.error('[api/ai] upstream error', error);
    return response.status(502).json({ error: 'AI service is temporarily unavailable' });
  }
}