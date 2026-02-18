<script lang="ts">
  import { getTagColor } from '@/lib/utils/tagColors';

  interface Props {
    tags: string[];
    activeTag?: string | null;
    onTagSelect?: (tag: string | null) => void;
  }

  let { tags, activeTag = $bindable<string | null>(null), onTagSelect }: Props = $props();

  function selectTag(tag: string | null) {
    activeTag = tag;
    onTagSelect?.(tag);
  }
</script>

<div class="flex flex-wrap gap-2 items-center">
  <button
    class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border {activeTag ===
    null
      ? 'bg-primary text-white border-primary shadow-md'
      : 'bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary/50 hover:border-border'}"
    onclick={() => selectTag(null)}
  >
    All
  </button>
  {#each tags as tag (tag)}
    {@const colors = getTagColor(tag)}
    <button
      class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border {activeTag ===
      tag
        ? `${colors.bg} ${colors.text} ${colors.border} shadow-md ring-1 ring-current/20`
        : 'bg-secondary/30 text-muted-foreground border-border/50 hover:bg-secondary/50 hover:border-border'}"
      onclick={() => selectTag(tag)}
    >
      {tag}
    </button>
  {/each}
</div>
