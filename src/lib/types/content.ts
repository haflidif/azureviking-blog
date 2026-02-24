import type { CollectionEntry } from 'astro:content';
import { getReadTime } from '@/lib/utils/readTime';
import { getPublishedPosts, getPostSlug } from '@/lib/utils/posts';
import { getCollection } from 'astro:content';
import { formatDate } from '@/lib/utils/date';

export type ContentCategory = 'blog' | 'talk' | 'tutorial' | 'lab' | 'news' | 'podcast';

export interface UnifiedContent {
  id: string;
  category: ContentCategory;
  title: string;
  description: string;
  date: Date;
  dateFormatted: string;
  tags: string[];
  slug: string;
  href: string;
  coverImage?: string;
  youtubeId?: string;
  readTime?: string;
  event?: string;
  duration?: string;
  featured?: boolean;
}

export const CATEGORY_META: Record<
  ContentCategory,
  { label: string; emoji: string; color: string }
> = {
  blog: { label: 'Blog', emoji: '📝', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  talk: { label: 'Talk', emoji: '🎬', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  tutorial: {
    label: 'Tutorial',
    emoji: '📺',
    color: 'bg-green-500/10 text-green-600 border-green-500/20',
  },
  lab: {
    label: 'Lab',
    emoji: '🧪',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  news: {
    label: 'News',
    emoji: '📰',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  podcast: {
    label: 'Podcast',
    emoji: '🎙️',
    color: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  },
};

export function postToUnified(post: CollectionEntry<'posts'>, basePath: string): UnifiedContent {
  const slug = getPostSlug(post);
  return {
    id: post.id,
    category: (post.data.category as ContentCategory) || 'blog',
    title: post.data.title,
    description: post.data.description,
    date: post.data.pubDate,
    dateFormatted: formatDate(post.data.pubDate),
    tags: post.data.tags,
    slug,
    href: `${basePath}/post/${slug}`,
    coverImage: post.data.coverImage ? `${basePath}${post.data.coverImage}` : undefined,
    readTime: getReadTime(post.body || ''),
    featured: post.data.featured,
  };
}

export function appearanceToUnified(
  item: CollectionEntry<'appearances'>,
  basePath: string
): UnifiedContent {
  return {
    id: item.id,
    category: (item.data.category as ContentCategory) || 'talk',
    title: item.data.title,
    description: item.data.description || '',
    date: item.data.date,
    dateFormatted: formatDate(item.data.date),
    tags: item.data.tags,
    slug: item.id,
    href: `${basePath}/appearances/${item.id}`,
    coverImage: item.data.coverImage ? `${basePath}${item.data.coverImage}` : undefined,
    youtubeId: item.data.youtubeId,
    event: item.data.event,
    duration: item.data.duration,
  };
}

export async function getAllUnifiedContent(basePath: string): Promise<UnifiedContent[]> {
  const posts = await getPublishedPosts();
  const appearances = await getCollection('appearances');

  const unified: UnifiedContent[] = [
    ...posts.map((p) => postToUnified(p, basePath)),
    ...appearances.map((a: CollectionEntry<'appearances'>) => appearanceToUnified(a, basePath)),
  ];

  return unified.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
