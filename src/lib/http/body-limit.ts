export class RequestBodyTooLargeError extends Error {
  constructor(readonly maxBytes: number) {
    super(`Request body exceeds ${maxBytes} bytes`);
    this.name = 'RequestBodyTooLargeError';
  }
}

/** Read a request body with a hard cap even when Content-Length is absent or forged. */
export async function readBodyBytesLimited(req: Request, maxBytes: number): Promise<Uint8Array<ArrayBuffer>> {
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) throw new RequestBodyTooLargeError(maxBytes);

  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array<ArrayBufferLike>[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new RequestBodyTooLargeError(maxBytes);
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readJsonLimited(req: Request, maxBytes: number): Promise<unknown> {
  const body = await readBodyBytesLimited(req, maxBytes);
  return JSON.parse(new TextDecoder().decode(body)) as unknown;
}
