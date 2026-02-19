<script lang="ts">
  type ContentCategory = 'blog' | 'talk' | 'tutorial' | 'lab' | 'news' | 'podcast';

  interface CategoryMeta {
    label: string;
    emoji: string;
    color: string;
  }

  interface Props {
    categories: ContentCategory[];
    counts: Record<string, number>;
    activeCategory: ContentCategory | null;
    totalCount: number;
  }

  let { categories, counts, activeCategory = $bindable(), totalCount }: Props = $props();

  const CATEGORY_META: Record<ContentCategory, CategoryMeta> = {
    blog: { label: 'Blog', emoji: '📝', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    talk: { label: 'Talk', emoji: '🎬', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
    tutorial: {
      label: 'Tutorial',
      emoji: '📺',
      color: 'bg-green-500/10 text-green-600 border-green-500/20',
    },
    lab: {
      label: 'Lab',
      emoji: '🧪',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
    news: {
      label: 'News',
      emoji: '📰',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    podcast: {
      label: 'Podcast',
      emoji: '🎙️',
      color: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    },
  };

  function selectCategory(cat: ContentCategory | null) {
    activeCategory = cat;
  }
</script>

<div class="flex flex-wrap gap-2 items-center">
  <button
    class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border {activeCategory === null
      ? 'bg-primary text-white border-primary shadow-md'
      : 'bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary/50 hover:border-border'}"
    onclick={() => selectCategory(null)}
  >
    All <span class="ml-1 opacity-70">{totalCount}</span>
  </button>
  {#each categories as cat (cat)}
    {@const meta = CATEGORY_META[cat]}
    <button
      class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 {activeCategory ===
      cat
        ? `${meta.color} shadow-md ring-1 ring-current/20`
        : 'bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary/50 hover:border-border'}"
      onclick={() => selectCategory(cat)}
    >
      <span class="text-sm leading-none">{meta.emoji}</span>
      {meta.label}
      <span class="opacity-70">{counts[cat] || 0}</span>
    </button>
  {/each}
</div>
