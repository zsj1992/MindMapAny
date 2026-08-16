'use client';

import { useEffect, useState } from 'react';
import { Workspace } from '@/components/Workspace';
import type { Plan } from '@/lib/credits';
import type { InputMode, InputPanelCopy } from '@/components/InputPanel';
import { takePendingPdf } from '@/lib/pending-file';

/**
 * 接住落地页交过来的输入，进工作台直接开始生成。
 *
 * 落地页只负责收链接/正文，收完就跳到这里 —— 用户点一次按钮，
 * 中间不再出现第二个"请再点一次生成"的界面。
 *
 * 输入走 sessionStorage 而不是查询串：正文可能很长，也可能是私人内容，
 * 不该出现在地址栏、浏览历史和 referer 里。链接虽然不敏感，但两条路径
 * 用同一套机制，少一种可能出错的分支。
 */

const PENDING_KEY = 'mma:pending-input';

export interface PendingInput {
  kind: 'text' | 'url';
  value: string;
}

export function storePendingInput(input: PendingInput): boolean {
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(input));
    return true;
  } catch {
    return false;
  }
}

export function PendingInputStarter(props: {
  plan: Plan | null;
  mode: InputMode;
  title: string;
  subtitle: string;
  copy: InputPanelCopy;
}) {
  const [pending, setPending] = useState<PendingInput | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // 放进定时器而不是同步执行：effect 里同步 setState 会触发级联渲染
    const timer = window.setTimeout(() => {
      // 只认一次：读完立刻清掉，刷新页面不该又跑一遍生成（那是要扣积分的）
      try {
        const raw = window.sessionStorage.getItem(PENDING_KEY);
        window.sessionStorage.removeItem(PENDING_KEY);
        if (raw) setPending(JSON.parse(raw) as PendingInput);
      } catch {
        // 读不到就当作正常进入工作台
      }
      // 文件走 IndexedDB：sessionStorage 存不下二进制
      void takePendingPdf()
        .then((found) => {
          if (found) setFile(found);
        })
        .catch(() => undefined)
        .finally(() => setReady(true));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // 等 sessionStorage 读完再挂载 Workspace：先挂再补输入的话，
  // 用户会先看到一个空输入框闪一下
  if (!ready) return null;

  return (
    <Workspace
      plan={props.plan}
      mode={props.mode}
      title={props.title}
      subtitle={props.subtitle}
      copy={props.copy}
      {...(pending?.kind === 'text' ? { initialText: pending.value } : {})}
      {...(pending?.kind === 'url' ? { initialUrl: pending.value } : {})}
      {...(file ? { initialFile: file } : {})}
      {...(pending || file ? { autoStart: true } : {})}
    />
  );
}
