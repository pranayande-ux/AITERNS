import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type ContinueResponse = {
  reply?: string;
  message?: string;
  content?: string;
  output?: string;
  result?: string;
  choices?: Array<{ text?: string; message?: { content?: string } }>;
};

const BASE_URL = 'https://api.hyperleapai.com';

function extractReply(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if ((data as ContinueResponse).reply) return (data as ContinueResponse).reply!;
  if ((data as ContinueResponse).message) return (data as ContinueResponse).message!;
  if ((data as ContinueResponse).content) return (data as ContinueResponse).content!;
  if ((data as ContinueResponse).output) return (data as ContinueResponse).output!;
  if ((data as ContinueResponse).result) return (data as ContinueResponse).result!;
  if ((data as ContinueResponse).choices?.[0]) {
    const c = (data as ContinueResponse).choices![0];
    return c.text || c.message?.content || null;
  }
  try {
    const s = JSON.stringify(data);
    return s.length > 2000 ? s.slice(0, 2000) + '…' : s;
  } catch {
    return null;
  }
}

async function request(path: string, init?: RequestInit) {
  const apiKey = Deno.env.get('HYPERLEAP_API_KEY');
  if (!apiKey) throw new Error('HYPERLEAP_API_KEY not configured');

  const url = `${BASE_URL}${path}`;
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('x-hl-api-key', apiKey);

  let attempt = 0;
  let lastErr: any = null;
  while (attempt < 3) {
    try {
      console.log(`HL call attempt ${attempt + 1}: ${path}`);
      const res = await fetch(url, { ...init, headers });
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error(`HL error ${res.status}: ${body}`);
        const err: any = new Error(`Upstream ${res.status}`);
        err.status = res.status;
        err.body = body;
        throw err;
      }
      return await res.json().catch(() => ({}));
    } catch (err) {
      lastErr = err;
      const status = (err as any).status as number | undefined;
      const transient = !status || (status >= 500 && status < 600);
      attempt++;
      if (!transient || attempt >= 3) break;
      await new Promise((r) => setTimeout(r, 200 * Math.pow(2, attempt)));
    }
  }
  throw lastErr;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { text, conversationId, model, system, externalUserId } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid input: text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apternsAppId = Deno.env.get('AITERNS_APP_ID');
    if (!apternsAppId) {
      console.error('AITERNS_APP_ID not configured');
      return new Response(JSON.stringify({ error: 'AIterns app not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let cid: string | null = conversationId ?? null;

    // Create AIterns conversation if missing
    if (!cid) {
      const payload = {
        externalUserId: externalUserId || 'anonymous-web-user',
      };
      
      console.log('Creating AIterns conversation with payload:', payload);
      const created = await request(`/apps/${apternsAppId}/conversations`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      cid = created?.conversationId || created?.id || created?.data?.conversationId || null;
      console.log('Created AIterns conversation response:', { created, cid });
      
      if (!cid) {
        console.error('Failed to create AIterns conversation - no ID returned');
        throw new Error('Failed to create AIterns conversation');
      }
    }

    // Continue AIterns conversation (non-streaming)
    console.log(`Continuing AIterns conversation ${cid} with message:`, text);
    const continued = await request(`/apps/${apternsAppId}/conversations/${cid}/continue`, {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });

    const reply = extractReply(continued) || "I couldn't generate a response right now. Please try again.";

    return new Response(JSON.stringify({ reply, conversationId: cid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Hyperleap integration error:', err?.message || err);
    const status = (err as any)?.status ? 502 : 503;
    const message = (err as any)?.status ? 'AI service temporarily unavailable' : 'Connection error - please try again';
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
