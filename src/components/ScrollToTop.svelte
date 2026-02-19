<script lang="ts">
  import { onMount } from 'svelte';

  let visible = $state(false);

  onMount(() => {
    const hasReadingProgress = !!document.getElementById('reading-progress');
    const update = () => {
      visible = !hasReadingProgress && window.scrollY > 300;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

{#if visible}
  <button
    onclick={scrollToTop}
    class="fixed right-5 bottom-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 cursor-pointer"
    aria-label="Scroll to top"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-4 h-4"
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
