'use client';

import { createAuthClient } from 'better-auth/react';

/** 浏览器端只用来发起登录 / 注册 / 登出，不碰任何数据 */
export const authClient = createAuthClient();
export const { signIn, signUp, signOut, useSession } = authClient;
