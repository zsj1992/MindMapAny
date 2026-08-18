import { NextResponse } from 'next/server';
import { accountSummary } from '@/lib/account/summary';

export const runtime = 'nodejs';

/**
 * 插件用来判断「用户登录了没有、还剩多少积分」。
 *
 * 内容和 /api/account 完全一致，只是这个路径已经写进了上架的插件里，
 * 改不了 —— 商店里跑着的旧版本会一直请求它。所以保留为别名。
 */
export async function GET() {
  return NextResponse.json(await accountSummary(), { headers: { 'cache-control': 'no-store' } });
}
