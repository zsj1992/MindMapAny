/**
 * 按行读一个 NDJSON 响应体。
 *
 * 网络分片和行边界没有任何关系：一个 chunk 可能带来半行，也可能一次带来三行。
 * 所以必须自己留缓冲，只在看到换行符时才交出一条 —— 直接对每个 chunk 做
 * JSON.parse 在本地跑得好好的，一上真实网络就随机报解析错误。
 */
export async function* readNdjson<T>(response: Response): AsyncGenerator<T> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let cut = buffer.indexOf('\n');
      while (cut >= 0) {
        const line = buffer.slice(0, cut).trim();
        buffer = buffer.slice(cut + 1);
        if (line) yield JSON.parse(line) as T;
        cut = buffer.indexOf('\n');
      }
    }
    // 服务端结尾总会带换行，但流被截断时缓冲里可能还剩半条，那条不完整，丢掉
    const tail = buffer.trim();
    if (tail) {
      try {
        yield JSON.parse(tail) as T;
      } catch {
        // 半条 JSON，无法使用
      }
    }
  } finally {
    reader.releaseLock();
  }
}
