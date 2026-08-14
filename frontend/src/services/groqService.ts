import { aiApi } from './apiClient';
import type { AiResponse } from '../types';

export async function askAI(
  userPrompt: string
): Promise<AiResponse> {
  return aiApi.ask(userPrompt);
}
