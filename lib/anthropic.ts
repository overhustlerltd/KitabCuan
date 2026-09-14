import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

export function extractJson<T>(rawText: string): T {
  const withoutFences = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");

  const start = withoutFences.search(/[{[]/);
  const end = Math.max(withoutFences.lastIndexOf("}"), withoutFences.lastIndexOf("]"));

  if (start === -1 || end === -1 || end < start) {
    throw new Error("Respons AI tidak mengandung JSON yang valid.");
  }

  return JSON.parse(withoutFences.slice(start, end + 1)) as T;
}
