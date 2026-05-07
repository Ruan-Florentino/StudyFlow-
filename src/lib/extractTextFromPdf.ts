import type { ExtractDocResult } from './extractDocumentText';

const MAX_CHARS_SEND_TO_AI = 48_000;

function truncateForModel(text: string): string {
  const trimmedText = text.trim();
  if (trimmedText.length <= MAX_CHARS_SEND_TO_AI) return trimmedText;
  return `${trimmedText.slice(0, MAX_CHARS_SEND_TO_AI)}\n\n[… texto truncado para análise …]`;
}

export async function extractTextFromPdf(file: File): Promise<ExtractDocResult> {
  try {
    const [pdfjs, workerModule] = await Promise.all([
      import('pdfjs-dist'),
      import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
    ]);
    const workerUrl = workerModule.default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    let extractedText = '';
    for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
      const page = await pdf.getPage(pageIndex);
      const content = await page.getTextContent();
      for (const item of content.items) {
        if (item && typeof item === 'object' && 'str' in item && typeof (item as { str: string }).str === 'string') {
          extractedText += `${(item as { str: string }).str} `;
        }
      }
      extractedText += '\n';
    }
    const trimmedText = extractedText.trim();
    if (!trimmedText) {
      return {
        ok: false,
        code: 'empty',
        message:
          'Não foi possível extrair texto deste PDF (pode ser só imagem escaneada). Tente um PDF com texto selecionável ou um arquivo .txt.',
      };
    }
    return { ok: true, text: truncateForModel(trimmedText) };
  } catch (error) {
    console.error('[ATHENA] PDF extract:', error);
    return {
      ok: false,
      code: 'pdf_fail',
      message: 'Falha ao extrair texto do PDF. Verifique se o arquivo não está corrompido.',
    };
  }
}
