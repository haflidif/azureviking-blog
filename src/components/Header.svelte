<script lang="ts">
  import { SITE } from '@/config';
  import ThemeToggle from './ThemeToggle.svelte';
  import Search from './Search.svelte';
  import logoImage from '@/site-assets/azure_viking_logo.png';

  interface NavLink {
    name: string;
    href: string;
  }

  const navLinks: NavLink[] = [
    { name: 'All Content', href: `${SITE.base}/content` },
    { name: 'Posts', href: `${SITE.base}/posts` },
    { name: 'Talks', href: `${SITE.base}/appearances` },
    { name: 'About', href: `${SITE.base}/about` },
  ];
</script>

<header
  class="sticky top-0 z-50 backdrop-blur-md bg-background/80 flex flex-col lg:flex-row items-center justify-between py-4 sm:py-5 gap-4 border-b border-border transition-all duration-300"
>
  <div class="flex items-center justify-between w-full lg:w-auto">
    <a
      href={SITE.base || '/'}
      class="flex items-center gap-2.5 text-xl sm:text-2xl font-black tracking-normal text-foreground transition-all no-underline hover:text-primary whitespace-nowrap"
    >
      <img
        src={logoImage.src}
        alt="AzureViking Logo"
        class="w-[80px] h-[80px] sm:w-[88px] sm:h-[88px]"
      />
      <span>{SITE.title}</span>
    </a>
    <div class="flex items-center gap-2 lg:hidden">
      <Search />
      <ThemeToggle />
    </div>
  </div>

  <nav class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
    <div class="flex items-center justify-center flex-wrap gap-x-2 gap-y-2 sm:gap-4">
      {#each navLinks as link (link.name)}
        <a
          href={link.href}
          class="px-1.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-accent hover:text-primary transition-all shrink-0"
        >
          {link.name}
        </a>
      {/each}
      {#each Object.entries(SITE.social) as [platform, link] (platform)}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform}
          class="px-1 py-1 rounded-md text-muted-foreground hover:text-primary transition-all"
        >
          {#if platform === 'github'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
              />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          {:else if platform === 'linkedin'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
              />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          {:else if platform === 'youtube'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              />
            </svg>
          {:else if platform === 'instagram'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
              />
            </svg>
          {:else if platform === 'meetup'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M18.71 12.21c-.17-.59-.75-1.07-1.09-1.26a1.61 1.61 0 0 0-.67-.18c-.12 0-.37 0-.57.16-.26.21-.38.57-.38.57s-.67 2.01-.72 2.15c-.15.42-.41.63-.73.63a.74.74 0 0 1-.74-.71c0-.1.02-.21.06-.34l1.47-5.07c.11-.37.17-.67.17-.91a1.2 1.2 0 0 0-1.2-1.2c-.66 0-1.08.45-1.24.99l-1.5 5.22s-.28.92-.95.92c-.48 0-.66-.42-.66-.71 0-.13.02-.25.06-.38l.96-3.35c.08-.27.11-.49.11-.67 0-.58-.38-1.07-1.07-1.07-.57 0-.99.39-1.14.91l-.99 3.53s-.26.88-.93.88c-.42 0-.65-.36-.65-.68 0-.12.02-.24.06-.37l1.44-4.97c.08-.27.12-.5.12-.7 0-.68-.5-1.17-1.17-1.17-.63 0-1.08.42-1.22.95L3.34 15.5a4.35 4.35 0 0 0-.16 1.14c0 2.08 1.56 3.62 3.64 3.62 1.63 0 2.8-.84 3.38-2.34.46 1.39 1.59 2.34 3.18 2.34 2.49 0 3.86-1.83 4.4-3.63l1.07-3.78c.05-.18.08-.34.08-.47a.73.73 0 0 0-.22-.17zM6.25 5.28a2.3 2.3 0 0 0 2.26-2.34A2.3 2.3 0 0 0 6.25.6 2.3 2.3 0 0 0 4 2.94a2.3 2.3 0 0 0 2.25 2.34z"
              />
            </svg>
          {:else if platform === 'sessionize'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4.5 h-4.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-1.5 16.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-4.5c-1.657 0-3-1.343-3-3V7.5a3 3 0 1 1 6 0V9c0 1.657-1.343 3-3 3z"
              />
            </svg>
          {/if}
        </a>
      {/each}
    </div>
    <div class="hidden lg:block h-4 w-px bg-border"></div>
    <div class="hidden lg:flex items-center gap-4">
      <Search />
      <ThemeToggle />
    </div>
  </nav>
</header>
