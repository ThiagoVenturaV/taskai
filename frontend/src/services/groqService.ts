import { AI_SYSTEM_PROMPT } from '../constants';
import type { AiResponse, Task } from '../types';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export async function askAI(
  userPrompt: string,
  currentTasks: Task[]
): Promise<AiResponse> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set');

  // Provide current board context so the model can resolve task names
  const boardContext = currentTasks
    .map((t) => `- [${t.id}] "${t.title}" → coluna: ${t.columnId}`)
    .join('\n');

  const contextMessage =
    currentTasks.length > 0
      ? `\nTarefas atuais no quadro:\n${boardContext}`
      : '\nO quadro está vazio no momento.';

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT + contextMessage },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) throw new Error('Empty response from AI');

  try {
    return JSON.parse(content) as AiResponse;
  } catch {
    throw new Error('AI returned invalid JSON');
  }
}
