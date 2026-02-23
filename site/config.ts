export interface SiteConfig {
  author: string;
  desc: string;
  title: string;
  ogImage: string;
  lang: string;
  base: string;
  website: string;
  social: Record<string, string>;
  googleAnalyticsId?: string;
  viewCounterApi?: string;
  homeHeroDescription: string;
  blogDescription: string;
  projectsDescription: string;

  // Homepage post counts
  featuredPostsCount: number;
  latestPostsCount: number;

  // Homepage projects
  homeProjects: {
    enabled: boolean;
    count: number;
  };

  // CTA (Call-to-Action) block for blog posts
  cta: {
    enabled: boolean;
    filePath: string; // Path to markdown file with CTA content
  };

  // Homepage Hero block
  hero: {
    enabled: boolean;
    filePath: string;
  };

  // Giscus comments configuration
  comments: {
    enabled: boolean;
    repo: string; // e.g., 'username/repo'
    repoId: string;
    category: string;
    categoryId: string;
    mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
    reactionsEnabled: boolean;
    emitMetadata: boolean;
    inputPosition: 'top' | 'bottom';
    theme: string; // e.g., 'preferred_color_scheme', 'light', 'dark'
    lang: string;
  };
}

export const SITE: SiteConfig = {
  author: 'Haflidi Fridthjofsson',
  desc: 'Senior Cloud Solution Architect at Microsoft. Former Microsoft MVP in Azure & Security. Sharing insights on Cloud Security, Infrastructure as Code, and Azure.',
  title: "Azureviking | Haflidi's Technical Insights",
  ogImage: 'og.png',
  lang: 'en-US',
  base: '/azureviking-blog',
  website: 'https://haflidif.github.io',
  social: {
    github: 'https://github.com/haflidif',
    linkedin: 'https://www.linkedin.com/in/haflidif',
    youtube: 'https://www.youtube.com/@azure-viking',
    instagram: 'https://www.instagram.com/azureviking',
    meetup: 'https://www.meetup.com/microsoft-security-user-group/',
    sessionize: 'https://sessionize.com/haflidif/',
  },
  googleAnalyticsId: '',
  viewCounterApi: '', // e.g., 'https://view-counter.youraccount.workers.dev/api/views'
  homeHeroDescription:
    'Senior Cloud Solution Architect at Microsoft. Former Microsoft MVP in Azure & Security. Sharing insights on Cloud Security, Infrastructure as Code, and Azure.',
  blogDescription:
    'Technical insights on Cloud Security, Azure, Infrastructure as Code, and identity.',
  projectsDescription: 'Open-source projects and Terraform modules I have built.',

  featuredPostsCount: 3,
  latestPostsCount: 6,

  homeProjects: {
    enabled: false,
    count: 4,
  },

  cta: {
    enabled: false,
    filePath: 'site/cta.md',
  },

  hero: {
    enabled: true,
    filePath: 'site/hero.md',
  },

  comments: {
    enabled: false,
    repo: 'haflidif/azureviking-blog',
    repoId: '',
    category: 'General',
    categoryId: '',
    mapping: 'pathname',
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lang: 'en',
  },
};
