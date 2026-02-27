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

<div class="hidden md:block mb-3 lg:mb-5 overflow-hidden">
  <img src={currentSrc} {alt} class="block w-full h-auto" loading="eager" decoding="async" />
</div>
