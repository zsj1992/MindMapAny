'use client';

import { createAuthClient } from 'better-auth/react';

/** 浏览器端只用来发起 OAuth 跳转和登出，不碰任何数据 */
export const authClient = createAuthClient();
export const { signIn, signOut, useSession } = authClient;
