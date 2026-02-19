<script lang="ts">
  import { onMount } from 'svelte';

  let progress = $state(0);
  let visible = $state(false);

  const RADIUS = 18;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let dashOffset = $derived(CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE);

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

<!-- Circular progress ring with scroll-to-top button — bottom right -->
<span id="reading-progress" class="hidden"></span>
{#if visible}
  <button
    onclick={scrollToTop}
    class="fixed right-5 bottom-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-background/90 border border-border shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 backdrop-blur-sm cursor-pointer"
    aria-label="Scroll to top"
    style="transition: opacity 0.3s, transform 0.2s;"
  >
    <!-- SVG progress ring -->
    <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
      <!-- Background circle -->
      <circle
        cx="22"
        cy="22"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        class="text-border/40"
      />
      <!-- Progress arc -->
      <circle
        cx="22"
        cy="22"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-dasharray={CIRCUMFERENCE}
        stroke-dashoffset={dashOffset}
        class="text-primary transition-all duration-150 ease-out"
      />
    </svg>
    <!-- Arrow icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4 text-foreground relative z-10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  </button>
{/if}
