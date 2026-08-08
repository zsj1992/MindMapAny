import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores(['.next/**', '.open-next/**', 'out/**', 'build/**', 'next-env.d.ts', 'worker-configuration.d.ts']),

  /**
   * 权限防线。
   *
   * Postgres 版靠 RLS 在数据库层强制"只能看自己的数据"，D1（SQLite）没有这个能力。
   * 替代方案是把所有查询收敛到 lib/db/repositories 一层，userId 作为必填参数。
   *
   * 但"收敛"如果只靠自觉，早晚会有人图省事直接拿 binding 查库 —— 那一刻防线就没了。
   * 所以这条规则把它变成构建期错误：除了 repositories 和 auth，谁 import DB binding 谁构建失败。
   */
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/db/**', 'src/lib/auth/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/lib/db/client', '@/lib/db/client'],
              message:
                '禁止直接使用 D1 binding。所有数据访问必须经过 @/lib/db/repositories/*，' +
                '那里是权限过滤的唯一执行点（详见 repositories/README.md）。',
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
