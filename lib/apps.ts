export type AppCategory =
  | "office"
  | "design"
  | "dev"
  | "media"
  | "social"
  | "system"
  | "education"
  | "lifestyle";

export type Platform =
  | "Windows"
  | "macOS"
  | "Linux"
  | "Android"
  | "iOS"
  | "Web"
  | "Cross-platform";

export interface AppVersion {
  version: string;
  updatedAt: string;
  changelog: string;
  platforms: Platform[];
  officialUrl: string;
  cnMirrorUrls?: string[];
}

export interface AppMeta {
  slug: string;
  name: string;
  category: AppCategory;
  description: string;
  iconUrl?: string;
  platforms: Platform[];
  tags?: string[];
  versions: AppVersion[];
}

export const CATEGORIES: { id: AppCategory; name: string }[] = [
  { id: "office", name: "办公软件" },
  { id: "design", name: "设计工具" },
  { id: "dev", name: "开发工具" },
  { id: "media", name: "娱乐影音" },
  { id: "social", name: "通讯社交" },
  { id: "system", name: "系统工具" },
  { id: "education", name: "教育学习" },
  { id: "lifestyle", name: "生活服务" }
];

// 说明：
// 1. 这里先提供每个类别若干示例应用，结构已经固定，可以按同样格式持续扩展到 500+。
// 2. 建议后续将这些数据迁移到 D1 表中，通过脚本批量导入，以便维护与检索。

export const APPS: AppMeta[] = [
  // 办公软件示例
  {
    slug: "microsoft-office",
    name: "Microsoft 365 Office",
    category: "office",
    description: "微软官方 Office 套件，包括 Word、Excel、PowerPoint 等。",
    platforms: ["Windows", "macOS", "Web"],
    tags: ["文档", "表格", "演示"],
    versions: [
      {
        version: "Microsoft 365（订阅版）",
        updatedAt: "2025-01-10",
        changelog: "持续更新的订阅制 Office，包含最新功能与云协作。",
        platforms: ["Windows", "macOS", "Web"],
        officialUrl: "https://www.microsoft.com/zh-cn/microsoft-365",
        cnMirrorUrls: [
          "https://officecdn.microsoft.com/",
          "https://www.microsoft.com/zh-cn/microsoft-365/buy/compare-all-microsoft-365-products"
        ]
      }
    ]
  },
  {
    slug: "wps-office",
    name: "WPS Office",
    category: "office",
    description: "金山出品的国产 Office 套件，兼容微软文档格式。",
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    tags: ["国产", "文档", "表格"],
    versions: [
      {
        version: "WPS Office 2024",
        updatedAt: "2024-12-20",
        changelog: "性能优化与云文档功能升级。",
        platforms: ["Windows", "macOS"],
        officialUrl: "https://www.wps.cn/product/wps",
        cnMirrorUrls: ["https://pc.wps.cn/"]
      }
    ]
  },
  // 设计工具示例
  {
    slug: "adobe-photoshop",
    name: "Adobe Photoshop",
    category: "design",
    description: "行业标准的图像处理与设计工具。",
    platforms: ["Windows", "macOS"],
    tags: ["位图", "修图"],
    versions: [
      {
        version: "Photoshop 2024",
        updatedAt: "2024-11-02",
        changelog: "加入生成式 AI 填充与性能优化。",
        platforms: ["Windows", "macOS"],
        officialUrl: "https://www.adobe.com/products/photoshop.html",
        cnMirrorUrls: ["https://www.adobe.com/cn/products/photoshop.html"]
      }
    ]
  },
  {
    slug: "figma",
    name: "Figma",
    category: "design",
    description: "云端协作 UI/UX 设计工具，支持多人实时协作。",
    platforms: ["Web", "Windows", "macOS"],
    tags: ["UI设计", "原型"],
    versions: [
      {
        version: "Figma Web",
        updatedAt: "2025-01-01",
        changelog: "持续交付更新，支持变量与组件化设计。",
        platforms: ["Web"],
        officialUrl: "https://www.figma.com/",
        cnMirrorUrls: [
          "https://www.figma.com/",
          "https://www.figma.com/downloads/"
        ]
      }
    ]
  },
  // 开发工具示例
  {
    slug: "visual-studio-code",
    name: "Visual Studio Code",
    category: "dev",
    description: "微软开源轻量级代码编辑器，拥有丰富插件生态。",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["IDE", "编辑器"],
    versions: [
      {
        version: "VS Code Stable",
        updatedAt: "2025-02-01",
        changelog: "按月发布稳定版本，支持远程开发与 AI 助手。",
        platforms: ["Windows", "macOS", "Linux"],
        officialUrl: "https://code.visualstudio.com/",
        cnMirrorUrls: [
          "https://vscode.cdn.azure.cn/",
          "https://code.visualstudio.com/Download"
        ]
      }
    ]
  },
  {
    slug: "jetbrains-intellij-idea",
    name: "IntelliJ IDEA",
    category: "dev",
    description: "JetBrains 出品的 Java/Kotlin 等多语言 IDE。",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["IDE", "Java"],
    versions: [
      {
        version: "IntelliJ IDEA 2024.3",
        updatedAt: "2024-12-15",
        changelog: "性能增强与新框架支持。",
        platforms: ["Windows", "macOS", "Linux"],
        officialUrl: "https://www.jetbrains.com/idea/",
        cnMirrorUrls: ["https://www.jetbrains.com/zh-cn/idea/"]
      }
    ]
  },
  // 娱乐影音示例
  {
    slug: "vlc-media-player",
    name: "VLC Media Player",
    category: "media",
    description: "开源跨平台播放器，几乎可以播放所有视频音频格式。",
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    tags: ["播放器", "开源"],
    versions: [
      {
        version: "VLC 3.0",
        updatedAt: "2024-10-01",
        changelog: "持续修复与兼容性更新。",
        platforms: ["Windows", "macOS", "Linux"],
        officialUrl: "https://www.videolan.org/vlc/",
        cnMirrorUrls: ["https://mirrors.tuna.tsinghua.edu.cn/videolan-ftp/vlc/"]
      }
    ]
  },
  // 通讯社交示例
  {
    slug: "wechat",
    name: "微信",
    category: "social",
    description: "腾讯出品的即时通讯与社交平台，是中国主流通讯工具。",
    platforms: ["Windows", "macOS", "Android", "iOS"],
    tags: ["即时通讯", "社交"],
    versions: [
      {
        version: "微信 2025",
        updatedAt: "2025-01-20",
        changelog: "性能优化与聊天体验改进。",
        platforms: ["Windows", "macOS", "Android", "iOS"],
        officialUrl: "https://weixin.qq.com/",
        cnMirrorUrls: ["https://pc.weixin.qq.com/"]
      }
    ]
  },
  // 系统工具示例
  {
    slug: "7zip",
    name: "7-Zip",
    category: "system",
    description: "开源压缩解压工具，支持多种压缩格式。",
    platforms: ["Windows"],
    tags: ["压缩", "解压"],
    versions: [
      {
        version: "7-Zip 24.x",
        updatedAt: "2024-09-01",
        changelog: "压缩比与性能优化。",
        platforms: ["Windows"],
        officialUrl: "https://www.7-zip.org/",
        cnMirrorUrls: [
          "https://www.7-zip.org/",
          "https://mirrors.aliyun.com/debian/pool/main/p/p7zip/"
        ]
      }
    ]
  },
  // 教育学习示例
  {
    slug: "anki",
    name: "Anki",
    category: "education",
    description: "开源间隔重复记忆软件，适合语言与知识点记忆。",
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    tags: ["记忆", "学习"],
    versions: [
      {
        version: "Anki 24.x",
        updatedAt: "2024-11-01",
        changelog: "同步与插件系统更新。",
        platforms: ["Windows", "macOS", "Linux"],
        officialUrl: "https://apps.ankiweb.net/",
        cnMirrorUrls: [
          "https://apps.ankiweb.net/",
          "https://github.com/ankitects/anki/releases"
        ]
      }
    ]
  },
  // 生活服务示例
  {
    slug: "alipay",
    name: "支付宝",
    category: "lifestyle",
    description: "蚂蚁集团的综合生活服务与支付平台。",
    platforms: ["Android", "iOS"],
    tags: ["支付", "生活服务"],
    versions: [
      {
        version: "支付宝 2025",
        updatedAt: "2025-01-05",
        changelog: "首页信息流与生活服务入口优化。",
        platforms: ["Android", "iOS"],
        officialUrl: "https://www.alipay.com/",
        cnMirrorUrls: ["https://mobile.alipay.com/index.htm"]
      }
    ]
  }
];

export function searchApps(keyword: string): AppMeta[] {
  const q = keyword.trim().toLowerCase();
  if (!q) return [];
  return APPS.filter((app) => {
    return (
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      (app.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  });
}

export function getAppsByCategory(category: AppCategory): AppMeta[] {
  return APPS.filter((app) => app.category === category).sort((a, b) =>
    a.name.localeCompare(b.name, "zh-CN")
  );
}

export function getAppBySlug(slug: string): AppMeta | undefined {
  return APPS.find((app) => app.slug === slug);
}

