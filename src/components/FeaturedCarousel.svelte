<script lang="ts">
  import { SITE } from '@/config';

  interface FeaturedPost {
    title: string;
    description: string;
    slug: string;
    coverImage?: string;
    tags: string[];
    pubDate: string;
    readTime: string;
  }

  interface Props {
    posts: FeaturedPost[];
    interval?: number;
  }

  let { posts, interval = 6000 }: Props = $props();

  let currentIndex = $state(0);
  let paused = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  function startTimer() {
    stopTimer();
    if (posts.length <= 1) return;
    timer = setInterval(() => {
      if (!paused) {
        currentIndex = (currentIndex + 1) % posts.length;
      }
    }, interval);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function goTo(index: number) {
    currentIndex = index;
    startTimer();
  }

  $effect(() => {
    startTimer();
    return () => stopTimer();
  });

  const currentPost = $derived(posts[currentIndex]);
</script>

<div
  class="relative rounded-2xl overflow-hidden border border-border/50 bg-secondary/20"
  role="region"
  aria-label="Featured posts carousel"
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
>
  <!-- Slides -->
  <a
    href={`${SITE.base}/posts/${currentPost.slug}`}
    class="block relative aspect-[16/7] overflow-hidden group no-underline"
  >
    <!-- Background image with crossfade -->
    {#each posts as post, i (post.slug)}
      {#if i === currentIndex}
        <div class="absolute inset-0 animate-fadeIn">
          {#if post.coverImage}
            <img
              src={`${SITE.base}${post.coverImage}`}
              alt={post.title}
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          {:else}
            <div
              class="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/50 to-accent/30"
            ></div>
          {/if}
        </div>
      {/if}
    {/each}

    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

    <!-- Content overlay -->
    <div class="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        {#each currentPost.tags.slice(0, 3) as tag (tag)}
          <span
            class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border backdrop-blur-sm bg-white/10 text-white border-white/20"
          >
            {tag}
          </span>
        {/each}
      </div>

      <!-- Title -->
      <h3
        class="text-base sm:text-lg font-black leading-tight text-white mb-1.5 line-clamp-2 group-hover:text-primary transition-colors"
      >
        {currentPost.title}
      </h3>

      <!-- Description -->
      <p class="text-xs text-white/80 leading-relaxed line-clamp-2 mb-2 max-w-[90%]">
        {currentPost.description}
      </p>

      <!-- Meta -->
      <div class="flex items-center gap-3 text-xs text-white/60 font-medium">
        <time>{currentPost.pubDate}</time>
        <span>·</span>
        <span>{currentPost.readTime}</span>
      </div>
    </div>
  </a>

  <!-- Dot indicators -->
  {#if posts.length > 1}
    <div class="absolute bottom-3 right-5 flex items-center gap-2 z-10">
      {#each posts as _, i (i)}
        <button
          class="w-2 h-2 rounded-full transition-all duration-300 {i === currentIndex
            ? 'bg-primary w-5'
            : 'bg-white/40 hover:bg-white/70'}"
          aria-label={`Go to slide ${i + 1}`}
          onclick={() => goTo(i)}
        ></button>
      {/each}
    </div>
  {/if}
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }
</style>
