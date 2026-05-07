import { extractTextFromTxt } from './extractTextFromTxt';

export type ExtractDocResult =
  | { ok: true; text: string }
  | { ok: false; code: 'empty' | 'unsupported' | 'pdf_fail' | 'read_fail'; message: string };

export async function extractTextFromUserFile(file: File): Promise<ExtractDocResult> {
  const name = file.name.toLowerCase();
  const type = file.type || '';

  if (type === 'text/plain' || name.endsWith('.txt')) {
    return extractTextFromTxt(file);
  }

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    const { extractTextFromPdf } = await import('./extractTextFromPdf');
    return extractTextFromPdf(file);
  }

  if (type.startsWith('image/')) {
    return {
      ok: false,
      code: 'unsupported',
      message:
        'Análise de imagem (OCR) não está disponível aqui. Use PDF com texto, .txt ou copie o texto para as Notas.',
    };
  }

  return {
    ok: false,
    code: 'unsupported',
    message: 'Formato não suportado. Use PDF com texto selecionável ou arquivo .txt.',
  };
}
