import assert from "node:assert/strict";
import { readNdjson } from "./read-ndjson";

/**
 * 网络分片和行边界毫无关系。这里刻意在最难受的位置切开：
 * 一行的正中间、恰好切在换行符前、一个分片里塞三行。
 * 直接对每个 chunk 做 JSON.parse 的实现会在第一个用例就挂掉。
 */
function responseFrom(chunks: string[]): Response {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const c of chunks) controller.enqueue(encoder.encode(c));
        controller.close();
      },
    }),
  );
}

async function collect(chunks: string[]): Promise<unknown[]> {
  const out: unknown[] = [];
  for await (const item of readNdjson(responseFrom(chunks))) out.push(item);
  return out;
}

async function run() {
  // 从行中间切开
  assert.deepEqual(
    await collect(['{"type":"par', 'tial","n":1}\n{"type":"done"}\n']),
    [{ type: "partial", n: 1 }, { type: "done" }],
    "跨分片的半行必须能拼回来",
  );

  // 一个分片里多行
  assert.deepEqual(
    await collect(['{"a":1}\n{"a":2}\n{"a":3}\n']),
    [{ a: 1 }, { a: 2 }, { a: 3 }],
    "单个分片里的多行要全部产出",
  );

  // 换行符自己单独成片
  assert.deepEqual(
    await collect(['{"a":1}', "\n", '{"a":2}\n']),
    [{ a: 1 }, { a: 2 }],
    "换行符单独到达也要能切",
  );

  // 结尾没有换行符
  assert.deepEqual(
    await collect(['{"a":1}\n{"a":2}']),
    [{ a: 1 }, { a: 2 }],
    "末行缺换行符仍要产出",
  );

  // 流被截断：残缺的半条 JSON 只能丢掉，不能让整个读取抛异常
  assert.deepEqual(
    await collect(['{"a":1}\n{"a":']),
    [{ a: 1 }],
    "截断的尾巴要静默丢弃",
  );

  // 空行不应产出 undefined
  assert.deepEqual(
    await collect(['{"a":1}\n\n\n{"a":2}\n']),
    [{ a: 1 }, { a: 2 }],
    "空行要跳过",
  );

  // 多字节字符被切成两半（中文标题在流式里很常见）
  const cn = new TextEncoder().encode('{"t":"思维导图"}\n');
  assert.deepEqual(
    await (async () => {
      const out: unknown[] = [];
      const res = new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(cn.slice(0, 9)); // 切在某个汉字的字节中间
            controller.enqueue(cn.slice(9));
            controller.close();
          },
        }),
      );
      for await (const item of readNdjson(res)) out.push(item);
      return out;
    })(),
    [{ t: "思维导图" }],
    "被切断的多字节字符要靠 stream 解码拼回来",
  );

  console.log("✓ NDJSON 按行读取：分片边界全部通过");
}

void run();
