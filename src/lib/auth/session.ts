import { headers } from 'next/headers';
import { getAuth } from './server';
import { getOrCreate, type Profile } from '@/lib/db/repositories/profiles';

/**
 * 服务端取当前用户。所有需要身份的地方只走这里，不要各自解析 cookie。
 * 拿不到就返回 null —— 未登录不是异常，游客能用试用额度。
 */

export interface SessionUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await getAuth().api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    };
  } catch {
    // 本地 next dev 下没有 D1 binding，登录整体降级为不可用而不是崩页面
    return null;
  }
}

/** 取用户及其档案（档案不存在会自动建，含赠送积分） */
export async function getCurrentProfile(): Promise<{ user: SessionUser; profile: Profile } | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  const profile = await getOrCreate(user.id, user.email);
  return { user, profile };
}
