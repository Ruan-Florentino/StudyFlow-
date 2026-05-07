import type { ExtractDocResult } from './extractDocumentText';

const MAX_CHARS_SEND_TO_AI = 48_000;

function truncateForModel(text: string): string {
  const trimmedText = text.trim();
  if (trimmedText.length <= MAX_CHARS_SEND_TO_AI) return trimmedText;
  return `${trimmedText.slice(0, MAX_CHARS_SEND_TO_AI)}\n\n[… texto truncado para análise …]`;
}

export async function extractTextFromTxt(file: File): Promise<ExtractDocResult> {
  try {
    const text = await file.text();
    const trimmedText = text.trim();
    if (!trimmedText) return { ok: false, code: 'empty', message: 'O arquivo de texto está vazio.' };
    return { ok: true, text: truncateForModel(trimmedText) };
  } catch {
    return { ok: false, code: 'read_fail', message: 'Não foi possível ler o arquivo de texto.' };
  }
}
