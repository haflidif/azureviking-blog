<script lang="ts">
  interface Props {
    title: string;
    urlPath: string;
  }

  let { title, urlPath }: Props = $props();
  let copied = $state(false);

  const getFullUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${urlPath}`;
  };

  const platforms = [
    {
      name: 'X',
      icon: 'M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.46-2.46l6.772-6.772',
      getShareUrl: (t: string, u: string) =>
        `https://x.com/intent/post?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
    },
    {
      name: 'LinkedIn',
      icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
      getShareUrl: (_t: string, u: string) =>
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`,
    },
    {
      name: 'Bluesky',
      icon: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.63 3.625 3.502 6.301 3.082-4.876.807-6.406 3.291-3.601 5.726C6.259 21.57 9.12 22 11.999 20.086 14.88 22 17.742 21.57 20.676 19.055c2.805-2.435 1.275-4.92-3.601-5.726 2.676.42 5.516-.452 6.3-3.082.247-.828.625-5.79.625-6.479 0-.688-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8',
      viewBox: '0 0 24 22',
      filled: true,
      getShareUrl: (t: string, u: string) =>
        `https://bsky.app/intent/compose?text=${encodeURIComponent(`${t} ${u}`)}`,
    },
    {
      name: 'Telegram',
      icon: 'M22 2L11 13M22 2l-7 20-4-9L2 9l20-7z',
      getShareUrl: (t: string, u: string) =>
        `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
    },
    {
      name: 'Facebook',
      icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
      getShareUrl: (_t: string, u: string) =>
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
    },
  ];

  const copyToClipboard = async () => {
    const url = getFullUrl();
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
</script>

<div class="flex flex-col gap-4 py-8 border-t border-border/50">
  <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
    Share this post
  </h3>

  <div class="flex items-center gap-2">
    {#each platforms as platform (platform.name)}
      <a
        href={platform.getShareUrl(title, getFullUrl())}
        target="_blank"
        rel="noopener noreferrer"
        class="p-2.5 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-primary transition-all duration-300"
        aria-label={`Share on ${platform.name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox={platform.viewBox || '0 0 24 24'}
          fill={platform.filled ? 'currentColor' : 'none'}
          stroke={platform.filled ? 'none' : 'currentColor'}
          stroke-width={platform.filled ? '0' : '2'}
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d={platform.icon} />
        </svg>
      </a>
    {/each}

    <button
      onclick={copyToClipboard}
      class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-accent text-muted-foreground hover:text-primary transition-all duration-300"
      aria-label="Copy link"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span class="text-xs font-bold uppercase tracking-widest">
        {copied ? 'Copied!' : 'Copy Link'}
      </span>
    </button>
  </div>
</div>
