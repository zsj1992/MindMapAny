import type { MindMap } from '@/lib/mindmap/schema';

/**
 * 把一次生成包装成 NDJSON 流：一行一个 JSON 事件。
 *
 * 用 NDJSON 而不是 SSE：我们只需要从服务端到客户端的单向推送，SSE 那套
 * `event:` / `data:` / 重连语义在这里全是多余的负担，而按行切分 fetch 的
 * ReadableStream 只要几行代码。
 *
 * 事件形状：
 *   {"type":"partial","map":{…}}   仅单遍路径，中途的图快照
 *   {"type":"done", …}             最终结果，字段和一次性 JSON 响应完全一致
 *   {"type":"error","code","message"}
 *
 * 关键约束：一旦第一个字节写出去，HTTP 状态码就固定是 200 了。
 * 所以生成阶段的失败只能以 error 事件的形式带内传回，退积分和记账
 * 也必须在这里完成 —— 外层的 catch 已经够不着了。
 */

export interface StreamRunResult {
  map: MindMap;
  warnings: string[];
  usage: { inputTokens: number; outputTokens: number; calls: number };
}

export function streamRun(opts: {
  run: (onPartial: (map: MindMap) => void) => Promise<StreamRunResult>;
  finish: (
    map: MindMap,
    warnings: string[],
    usage: StreamRunResult['usage'],
  ) => Promise<Record<string, unknown>>;
  onFailure: (code: string, message: string) => Promise<void>;
}): Response {
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (event: Record<string, unknown>) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // 客户端已经断开：继续跑完是浪费，但中断生成要靠 AbortSignal，
          // 这里只是别再往一个关掉的流里写
          closed = true;
        }
      };

      try {
        // 节流：模型吐得比浏览器画得快，每行都推会让主线程一直在重排。
        // 80ms 一帧，人眼看着仍然是连续长出来的。
        let lastPush = 0;
        const result = await opts.run((map) => {
          const now = Date.now();
          if (now - lastPush < 80) return; // 丢掉的帧不用补：done 紧接着就到
          lastPush = now;
          send({ type: 'partial', map });
        });

        send({ type: 'done', ...(await opts.finish(result.map, result.warnings, result.usage)) });
      } catch (error) {
        const aborted = error instanceof Error && error.name === 'AbortError';
        const code = aborted ? 'aborted' : 'generation_failed';
        const message = aborted
          ? 'Generation was stopped'
          : error instanceof Error
            ? error.message
            : 'Generation failed';
        // 用户主动停止也要退积分：他没拿到图
        await opts.onFailure(code, message).catch(() => undefined);
        send({ type: 'error', code, message });
      } finally {
        closed = true;
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store',
      // Cloudflare 和中间代理默认会缓冲，缓冲了就没有「边生成边出现」可言
      'x-accel-buffering': 'no',
    },
  });
}
