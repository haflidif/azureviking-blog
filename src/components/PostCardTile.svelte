<script lang="ts">
  import { formatDate } from '@/lib/utils/date';
  import { getTagColor } from '@/lib/utils/tagColors';
  import { SITE } from '@/config';

  interface Props {
    post: {
      id: string;
      body?: string;
      data: {
        title: string;
        description: string;
        pubDate: Date;
        tags: string[];
        featured?: boolean;
        coverImage?: string;
        lang?: string;
      };
    };
    readTime: string;
    slug: string;
  }

  let { post, readTime, slug }: Props = $props();

  const coverUrl = $derived(post.data.coverImage ? `${SITE.base}${post.data.coverImage}` : null);
</script>

<a
  href={`${SITE.base}/post/${slug}`}
  class="group block rounded-2xl overflow-hidden border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline"
>
  <!-- Thumbnail -->
  <div class="aspect-[16/9] overflow-hidden bg-secondary/50 relative">
    {#if coverUrl}
      <img
        src={coverUrl}
        alt={post.data.title}
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    {:else}
      <div
        class="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12 h-12 text-muted-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
    {/if}

    <!-- Featured badge -->
    {#if post.data.featured}
      <div
        class="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-white text-xs font-bold backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
        Featured
      </div>
    {/if}
  </div>

  <!-- Content -->
  <div class="p-3 sm:p-4 flex flex-col gap-2">
    <!-- Tags -->
    <div class="flex flex-wrap gap-1">
      {#each post.data.tags.slice(0, 3) as tag (tag)}
        {@const colors = getTagColor(tag)}
        <span
          class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border {colors.bg} {colors.text} {colors.border}"
        >
          {tag}
        </span>
      {/each}
    </div>

    <!-- Title -->
    <h3
      class="text-sm sm:text-base font-black leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2"
    >
      {post.data.title}
    </h3>

    <!-- Description -->
    <p class="text-xs text-muted-foreground leading-relaxed line-clamp-2">
      {post.data.description}
    </p>

    <!-- Meta -->
    <div
      class="flex items-center gap-3 text-xs text-muted-foreground font-medium pt-1 mt-auto border-t border-border/30"
    >
      <time datetime={post.data.pubDate.toISOString()} class="tabular-nums">
        {formatDate(post.data.pubDate)}
      </time>
      <span class="text-border">·</span>
      <div class="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {readTime}
      </div>
    </div>
  </div>
</a>
