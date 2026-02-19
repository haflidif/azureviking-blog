<script lang="ts">
  type ContentCategory = 'blog' | 'talk' | 'tutorial' | 'lab' | 'news' | 'podcast';

  interface Props {
    categories: ContentCategory[];
    counts: Record<string, number>;
    activeCategory: ContentCategory | null;
    totalCount: number;
  }

  let { categories, counts, activeCategory = $bindable(), totalCount }: Props = $props();

  const CATEGORY_LABELS: Record<ContentCategory, string> = {
    blog: 'Blog',
    talk: 'Talk',
    tutorial: 'Tutorial',
    lab: 'Lab',
    news: 'News',
    podcast: 'Podcast',
  };

  function selectCategory(cat: ContentCategory | null) {
    activeCategory = cat;
  }
</script>

<div class="flex flex-wrap gap-1.5 items-center">
  <button
    class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border {activeCategory ===
    null
      ? 'bg-foreground text-background border-foreground shadow-md'
      : 'bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary/50 hover:border-border'}"
    onclick={() => selectCategory(null)}
  >
    All {totalCount}
  </button>
  {#each categories as cat (cat)}
    <button
      class="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all border {activeCategory ===
      cat
        ? 'bg-foreground text-background border-foreground shadow-md'
        : 'bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary/50 hover:border-border'}"
      onclick={() => selectCategory(cat)}
    >
      {CATEGORY_LABELS[cat]}
      {counts[cat] || 0}
    </button>
  {/each}
</div>
