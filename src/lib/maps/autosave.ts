import { countOwned, create } from '@/lib/db/repositories/maps';
import type { InputKind } from '@/lib/extract/types';
import type { MindMap } from '@/lib/mindmap/schema';

/**
 * 生成成功即入库。
 *
 * 保存失败绝不能让生成失败：用户已经付了积分、图已经在手上，
 * 因为写库出错而把整次请求判为失败，等于既扣钱又不给东西。
 * 所以这里吞掉异常，只把结果告诉调用方，由接口原样透传给前端。
 *
 * 但也不能静默：自动保存会比手动保存快得多地撞到 100 张的上限，
 * 撞上之后用户以为「都存好了」而实际没存，比一开始就不自动保存更糟。
 * 所以撞顶和写失败分开报，前端才能说清楚原因。
 */

export const MAX_SAVED_MAPS = 100;

export type AutoSaveResult =
  | { saved: true; id: string }
  | { saved: false; reason: 'limit_reached' | 'failed' };

export async function autoSaveMap(
  userId: string,
  input: { map: MindMap; sourceKind: InputKind; sourceUrl?: string },
): Promise<AutoSaveResult> {
  try {
    if ((await countOwned(userId)) >= MAX_SAVED_MAPS) return { saved: false, reason: 'limit_reached' };
    return { saved: true, id: await create(userId, input) };
  } catch (error) {
    console.error('[maps] autosave_failed', error);
    return { saved: false, reason: 'failed' };
  }
}
