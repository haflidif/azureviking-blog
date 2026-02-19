<script lang="ts">
  let {
    lightSrc,
    darkSrc,
    alt = 'Azure Viking',
  }: {
    lightSrc: string;
    darkSrc: string;
    alt?: string;
  } = $props();

  let isDark = $state(false);

  $effect(() => {
    isDark = document.documentElement.classList.contains('dark');

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  });

  const currentSrc = $derived(isDark ? darkSrc : lightSrc);
</script>

<div class="mb-6 lg:mb-10 w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden">
  <img
    src={currentSrc}
    {alt}
    class="block w-full object-cover h-28 sm:h-36 md:h-auto scale-[2] sm:scale-150 md:scale-100 origin-center"
    loading="eager"
    decoding="async"
  />
</div>
