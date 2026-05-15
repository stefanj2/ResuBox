import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    client = new Anthropic();
  }
  return client;
}

/**
 * Model selection. Haiku is the default — fast and cheap enough that we can
 * afford to call it on every keystroke if we want. Sonnet is reserved for
 * vacancy matching, which requires deeper analysis across the whole CV.
 */
export const MODEL = {
  fast: 'claude-haiku-4-5',
  smart: 'claude-sonnet-4-6',
} as const;

export { Anthropic };
