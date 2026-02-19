<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import UnifiedCard from './UnifiedCard.svelte';
  import CategoryFilter from './CategoryFilter.svelte';
  import TagFilter from './TagFilter.svelte';

  type ContentCategory = 'blog' | 'talk' | 'tutorial' | 'lab' | 'news' | 'podcast';

  interface ContentItem {
    id: string;
    category: ContentCategory;
    title: string;
    description: string;
    dateFormatted: string;
    tags: string[];
    href: string;
    coverImage?: string;
    youtubeId?: string;
    readTime?: string;
    event?: string;
    duration?: string;
    featured?: boolean;
  }

  interface Props {
    items: ContentItem[];
    showCategoryFilter?: boolean;
    showTagFilter?: boolean;
  }

  let { items, showCategoryFilter = true, showTagFilter = true }: Props = $props();

  let activeCategory: ContentCategory | null = $state(null);
  let activeTag: string | null = $state(null);

  // Reset tag when category changes
  $effect(() => {
    if (activeCategory !== null) {
      activeTag = null;
    }
  });

  // Unique categories that exist in the data
  const availableCategories = $derived(
    [...new Set(items.map((i) => i.category))].sort() as ContentCategory[]
  );

  const categoryCounts = $derived.by(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  });

  // Filter by category first
  const categoryFiltered = $derived(
    activeCategory ? items.filter((i) => i.category === activeCategory) : items
  );

  // Collect tags from category-filtered items
  const tagCounts = $derived.by(() => {
    const counts = new SvelteMap<string, number>();
    for (const item of categoryFiltered) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return counts;
  });

  const allTags = $derived(
    [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
  );

  // Filter by tag
  const filteredItems = $derived(
    activeTag ? categoryFiltered.filter((i) => i.tags.includes(activeTag!)) : categoryFiltered
  );
</script>

<div class="flex flex-col gap-4">
  {#if showCategoryFilter && availableCategories.length > 1}
    <CategoryFilter
      categories={availableCategories}
      counts={categoryCounts}
      bind:activeCategory
      totalCount={items.length}
    />
  {/if}

  {#if showTagFilter && allTags.length > 0}
    <TagFilter tags={allTags} bind:activeTag />
  {/if}

  {#if filteredItems.length === 0}
    <p class="text-center text-muted-foreground py-12 text-sm">No content found.</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {#each filteredItems as item (item.id)}
        <UnifiedCard {...item} />
      {/each}
    </div>
  {/if}
</div>
