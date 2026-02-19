<script lang="ts">
  import { SITE } from '@/config';
  import { getTagColor } from '@/lib/utils/tagColors';

  interface Props {
    title: string;
    event: string;
    date: string;
    type: string;
    slug: string;
    youtubeId?: string;
    description?: string;
    tags?: string[];
    duration?: string;
    coverImage?: string;
  }

  let {
    title,
    event,
    date,
    type,
    slug,
    youtubeId,
    description,
    tags = [],
    duration,
    coverImage,
  }: Props = $props();

  const thumbnail = $derived(
    coverImage
      ? `${SITE.base}${coverImage}`
      : youtubeId
        ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
        : null
  );

  const href = $derived(`${SITE.base}/appearances/${slug}`);
</script>

<a {href} class="group block no-underline">
  <article
    class="rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
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
        <!-- Play button overlay -->
        {#if youtubeId}
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          >
            <div
              class="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            >
              <svg class="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        {/if}
        <!-- Type badge -->
        <span
          class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-black/60 text-white backdrop-blur-sm"
        >
          {type}
        </span>
        <!-- Duration badge -->
        {#if duration}
          <span
            class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm"
          >
            {duration}
          </span>
        {/if}
      </div>
    {/if}

    <!-- Content -->
    <div class="p-3 sm:p-4">
      <!-- Event badge -->
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20 mb-2"
      >
        {event}
      </span>

      <!-- Title -->
      <h3
        class="text-sm font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5"
      >
        {title}
      </h3>

      <!-- Description -->
      {#if description}
        <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
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
      <div class="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
        <time>{date}</time>
      </div>
    </div>
  </article>
</a>
