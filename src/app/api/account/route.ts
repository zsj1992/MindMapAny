import { NextResponse } from 'next/server';
import { accountSummary } from '@/lib/account/summary';

export const runtime = 'nodejs';

/**
 * 当前账号摘要。未登录返回 200 + signedIn:false —— 「没登录」是一种
 * 正常状态，不是失败的请求，调用方要据此渲染游客视图。
 *
 * 必须 no-store：这是随人而变的内容，被 CDN 缓存一次就会把某个人的
 * 套餐显示给所有人。
 */
export async function GET() {
  return NextResponse.json(await accountSummary(), { headers: { 'cache-control': 'no-store' } });
}
