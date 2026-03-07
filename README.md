## AppWarehouse · 通用应用仓库与 Cloudflare 隧道

基于 **Next.js 14（App Router）+ Tailwind CSS + @cloudflare/next-on-pages** 构建，运行在 **Cloudflare Pages + D1 + KV** 之上，聚焦：

- **应用仓库**：8 大类通用应用的官网导航与版本信息；
- **触点体系**：广告点击 / 邀请获取触点，Cloudflare 隧道按 15 分钟消耗触点；
- **软隧道**：基于 Cloudflare Pages Functions 的受控代理，面向中国用户的可访问性优化；
- **广告适配**：预留多处 AdSense 友好广告位。

### 1. 本地开发与构建自检

```bash
npm install
npm run dev
```

**推送前建议**：在本地执行 `npm run build`，可模拟 Cloudflare 的 TypeScript 与 Next 构建，减少远程构建失败。快速类型检查可运行 `npm run build:check`。

需要准备的环境变量（在 Cloudflare Pages / 本地 `.env` 中设置）：

- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_ORIGIN`（例如 `https://your-appwarehouse-domain.pages.dev`）

### 2. Cloudflare D1 创建与表结构

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  referral_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE points (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tunnel_usage (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  points_consumed INTEGER DEFAULT 1,
  auto_renew BOOLEAN DEFAULT false
);

CREATE TABLE app_collections (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  app_name TEXT NOT NULL,
  app_version TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE referrals (
  id TEXT PRIMARY KEY,
  inviter_user_id TEXT REFERENCES users(id),
  invited_user_id TEXT REFERENCES users(id),
  click_count INTEGER DEFAULT 0,
  signup_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

在 `wrangler.toml` 中绑定 D1 与 KV，并在 Cloudflare 控制台中创建实际实例与 ID。

### 3. 核心路由

- `/`：首页，总览 + 顶部广告位；
- `/apps`、`/apps/[category]`、`/apps/detail/[slug]`：应用仓库与版本信息；
- `/login`：邮箱 + 密码 / Google 登录（NextAuth）；
- `/account`：触点余额、隧道记录、收藏、邀请链接；
- `/tunnel`：输入网址，开启 15 分钟触点隧道；
- `/api/tunnel/start`、`/api/tunnel/proxy`：隧道启动与软代理逻辑（Edge Runtime）；
- `/api/user/register`：邮箱注册（密码哈希存储，写入 D1）；
- `/api/auth/[...nextauth]`：NextAuth 登录与会话。

### 4. 应用仓库数据扩展

当前的 `lib/apps.ts` 中为每个类别提供了若干高频应用示例，并定义了完整的数据结构（含国内映射链接字段）。  
实际部署时，可按同一结构扩展到 **每个类别 500+ 应用**，建议：

- 使用脚本从维护良好的应用目录 / 自建表格导出为 JSON；
- 通过 D1 批量导入，并在 API 层按分类、搜索等规则返回；
- 或继续采用硬编码形式，但拆分为多文件以便维护与按需加载。

