<script lang="ts">
  import { SITE } from '@/config';

  let { slug }: { slug: string } = $props();

  let count = $state<number | null>(null);

  $effect(() => {
    if (!SITE.viewCounterApi) return;

    fetch(`${SITE.viewCounterApi}/${slug}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        count = data.count;
      })
      .catch(() => {
        // Silently fail — view counter is non-critical
      });
  });
</script>

{#if SITE.viewCounterApi && count !== null}
  <span class="hidden sm:inline text-border">•</span>
  <div class="flex items-center gap-1.5">
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
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
    {count.toLocaleString()} views
  </div>
{/if}
