'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 悬停展开的开合逻辑。共享给页头的两个下拉框。
 *
 * 关闭要延迟 260ms：鼠标从触发器斜着移到面板的路径上难免掠过两者之外的空白，
 * 立刻关会让菜单在指针底下闪掉。最初写的 120ms 实测不够，指针还没进面板就关了。
 * 展开则不延迟 —— 迟滞感比误触更烦人。
 */
export function useHoverMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    // 键盘 Tab 出整个菜单时也要收起来，否则焦点已经在页面别处、面板还开着
    const onFocusIn = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [open]);

  return {
    open,
    setOpen,
    rootRef,
    handlers: {
      onMouseEnter: () => {
        cancelClose();
        setOpen(true);
      },
      onMouseLeave: () => {
        cancelClose();
        closeTimer.current = window.setTimeout(() => setOpen(false), 260);
      },
      onFocus: () => {
        cancelClose();
        setOpen(true);
      },
    },
  };
}
