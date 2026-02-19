<script lang="ts">
  import { getTagColor } from '@/lib/utils/tagColors';

  type ContentCategory = 'blog' | 'talk' | 'tutorial' | 'lab' | 'news' | 'podcast';

  interface CategoryMeta {
    label: string;
    emoji: string;
    color: string;
  }

  interface Props {
    id: string;
    category: ContentCategory;
    title: string;
    description: string;
    dateFormatted: string;
    tags: string[];
    href: string;
    coverImage?: string;
    youtubeId?: string;
    readTime?: string;
    event?: string;
    duration?: string;
    featured?: boolean;
  }

  let {
    category,
    title,
    description,
    dateFormatted,
    tags,
    href,
    coverImage,
    youtubeId,
    readTime,
    event,
    duration,
  }: Props = $props();

  const CATEGORY_META: Record<ContentCategory, CategoryMeta> = {
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

  const meta = $derived(CATEGORY_META[category]);

  const thumbnail = $derived(
    coverImage
      ? coverImage
      : youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
        : null
  );
</script>

<a {href} class="group block no-underline">
  <article
    class="rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
  >
    <!-- Thumbnail -->
    {#if thumbnail}
      <div class="relative aspect-video overflow-hidden bg-secondary/20">
        <img
          src={thumbnail}
          alt={title}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <!-- Play button for talks -->
        {#if youtubeId}
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            >
              <svg class="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        {/if}
        <!-- Category badge -->
        <span
          class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border backdrop-blur-sm {meta.color}"
        >
          {meta.emoji}
          {meta.label}
        </span>
        <!-- Duration for talks -->
        {#if duration}
          <span
            class="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm"
          >
            {duration}
          </span>
        {/if}
      </div>
    {:else}
      <!-- No thumbnail: show category badge inline -->
      <div class="px-3 pt-3">
        <span
          class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border {meta.color}"
        >
          {meta.emoji}
          {meta.label}
        </span>
      </div>
    {/if}

    <!-- Content -->
    <div class="p-3 sm:p-4 flex flex-col flex-1">
      <!-- Event badge for talks -->
      {#if event}
        <span
          class="inline-flex items-center self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20 mb-1.5"
        >
          {event}
        </span>
      {/if}

      <!-- Title -->
      <h3
        class="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5"
      >
        {title}
      </h3>

      <!-- Description -->
      {#if description}
        <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2 flex-1">
          {description}
        </p>
      {/if}

      <!-- Tags -->
      {#if tags.length > 0}
        <div class="flex flex-wrap gap-1 mb-2">
          {#each tags.slice(0, 3) as tag (tag)}
            {@const colors = getTagColor(tag)}
            <span
              class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border {colors.bg} {colors.text} {colors.border}"
            >
              {tag}
            </span>
          {/each}
        </div>
      {/if}

      <!-- Meta -->
      <div class="flex items-center gap-2 text-[11px] text-muted-foreground font-medium mt-auto">
        <time>{dateFormatted}</time>
        {#if readTime}
          <span>·</span>
          <span>{readTime}</span>
        {/if}
      </div>
    </div>
  </article>
</a>
