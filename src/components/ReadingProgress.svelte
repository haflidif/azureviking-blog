<script lang="ts">
  import { onMount } from 'svelte';

  let progress = $state(0);
  let visible = $state(false);

  onMount(() => {
    const update = () => {
      const el = document.querySelector('article');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      progress = Math.min(100, Math.max(0, (scrolled / total) * 100));
      visible = scrolled > 100;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<!-- Vertical progress bar on the left -->
<div
  class="fixed left-0 top-0 z-50 h-full w-1 bg-border/30 transition-opacity duration-300"
  class:opacity-0={!visible}
  class:opacity-100={visible}
>
  <div
    class="w-full bg-primary transition-all duration-150 ease-out rounded-b"
    style="height: {progress}%"
  ></div>
</div>

<!-- Scroll to top button -->
{#if visible}
  <button
    onclick={scrollToTop}
    class="fixed left-3 bottom-6 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-all duration-200 opacity-80 hover:opacity-100"
    aria-label="Scroll to top"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  </button>
{/if}
