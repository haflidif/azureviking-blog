<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import PostCardTile from './PostCardTile.svelte';
  import TagFilter from './TagFilter.svelte';

  interface PostData {
    id: string;
    body?: string;
    data: {
      title: string;
      description: string;
      pubDate: Date;
      tags: string[];
      featured?: boolean;
      coverImage?: string;
      lang?: string;
    };
  }

  interface PostWithMeta {
    post: PostData;
    slug: string;
    readTime: string;
  }

  interface Props {
    posts: PostWithMeta[];
    showFilter?: boolean;
  }

  let { posts, showFilter = true }: Props = $props();

  // Collect unique tags sorted by frequency
  const tagCounts = $derived.by(() => {
    const counts = new SvelteMap<string, number>();
    for (const { post } of posts) {
      for (const tag of post.data.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return counts;
  });

  const allTags = $derived(
    [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag)
  );

  let activeTag: string | null = $state(null);

  const filteredPosts = $derived(
    activeTag ? posts.filter(({ post }) => post.data.tags.includes(activeTag!)) : posts
  );
</script>

<div class="flex flex-col gap-6">
  {#if showFilter && allTags.length > 0}
    <TagFilter tags={allTags} bind:activeTag />
  {/if}

  {#if filteredPosts.length === 0}
    <p class="text-center text-muted-foreground py-12 text-sm">No posts found for this tag.</p>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {#each filteredPosts as { post, slug, readTime } (post.id)}
        <PostCardTile {post} {slug} {readTime} />
      {/each}
    </div>
  {/if}
</div>
