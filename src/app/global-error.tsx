'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-5 text-[#102033]">
        <main className="w-full max-w-md rounded-3xl border border-[#dce4ef] bg-white p-8 text-center shadow-xl shadow-[#102f53]/5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl text-red-600">!</div>
          <h1 className="mt-5 text-2xl font-bold">页面暂时出了点问题</h1>
          <p className="mt-3 text-sm leading-6 text-[#607086]">错误已经记录。你可以立即重试，未保存的内容请先不要关闭当前标签页。</p>
          <button type="button" onClick={reset} className="mt-6 h-11 rounded-xl bg-[#155eef] px-6 text-sm font-semibold text-white">重新加载</button>
        </main>
      </body>
    </html>
  );
}
