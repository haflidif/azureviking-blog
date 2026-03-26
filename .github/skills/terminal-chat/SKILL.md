---
name: terminal-chat
description: >
  Generates animated terminal chat HTML blocks for blog posts. Shows conversation
  flow with typewriter prompt, optional reasoning phase, and staggered agent responses.
  USE FOR: terminal chat, copilot conversation, squad demo, agent visualization,
  animated code block, thinking animation, reasoning block, copilot thinking,
  multi-agent demo, parallel agents, terminal UI, chat component.
---

# Terminal Chat Skill

You generate animated terminal chat HTML blocks for the AzureViking blog. These blocks visualize AI conversations — a prompt types out character by character, an optional reasoning phase fades in, then response agents stagger in one by one. All powered by CSS animations + a small inline script in the post layout.

## When to Use

- Showing a **Copilot CLI conversation** with reasoning
- Demonstrating **Squad multi-agent** parallel work
- Visualizing any **prompt → thinking → response** flow
- Making technical blog posts more engaging and interactive

## HTML Structure

Every terminal chat block uses this structure. Paste directly into `.md` blog posts.

### Minimal (no reasoning)

```html
<div class="terminal-chat" data-animate>
  <div class="terminal-chat-glow"></div>
  <div class="terminal-chat-inner">
    <div class="terminal-chat-header">
      <div class="terminal-chat-dots"><span></span><span></span><span></span></div>
      <span class="terminal-chat-title">Copilot Chat</span>
    </div>
    <div class="terminal-chat-body">
      <div>
        <p class="terminal-chat-label">YOU</p>
        <p class="terminal-chat-prompt">Your prompt text here.</p>
      </div>
      <hr class="terminal-chat-divider" />
      <div class="terminal-chat-response">
        <p class="terminal-chat-label">COPILOT</p>
        <div class="terminal-chat-agents">
          <div class="agent-line" style="--delay: 0">
            <span class="agent-icon agent-icon-blue">💡</span>
            <div>
              <span class="agent-name agent-name-blue">AgentName</span>
              <span class="agent-task"> — what the agent is doing</span>
            </div>
          </div>
        </div>
      </div>
      <div class="terminal-chat-status">
        <div class="terminal-chat-status-dots"><span></span><span></span><span></span></div>
        <span class="terminal-chat-status-text">Response complete</span>
      </div>
    </div>
  </div>
</div>
```

### With Reasoning Phase

Insert the reasoning block between the prompt `<div>` and the `<hr class="terminal-chat-divider">`:

```html
<div class="terminal-chat-reasoning">
  <p class="terminal-chat-reasoning-label">
    🤖 <span class="thinking-indicator">Thinking...</span>
  </p>
  <p class="reasoning-line">First reasoning step...</p>
  <p class="reasoning-line">Second reasoning step...</p>
  <p class="reasoning-line">Third reasoning step...</p>
</div>
```

## Title Bar Conventions

| Context      | Title          |
| ------------ | -------------- |
| Copilot CLI  | `Copilot Chat` |
| Squad agents | `Squad`        |
| Generic      | `Terminal`     |

## Reasoning Label Conventions

| Context      | Label                                                                   |
| ------------ | ----------------------------------------------------------------------- |
| Copilot CLI  | `🤖 <span class="thinking-indicator">Thinking...</span>`                |
| Squad agents | `🧠 <span class="thinking-indicator">Coordinator is thinking...</span>` |

## Response Label Conventions

| Context      | Label            |
| ------------ | ---------------- |
| Copilot CLI  | `COPILOT`        |
| Squad agents | `SQUAD RESPONSE` |
| Generic      | `RESPONSE`       |

## Agent Colors

9 colors are available. Use them to visually distinguish agents:

| Color  | CSS Classes                             | Best For                      |
| ------ | --------------------------------------- | ----------------------------- |
| yellow | `agent-icon-yellow` `agent-name-yellow` | Planning, architecture        |
| blue   | `agent-icon-blue` `agent-name-blue`     | Frontend, UI, recommendations |
| green  | `agent-icon-green` `agent-name-green`   | Backend, APIs, success states |
| purple | `agent-icon-purple` `agent-name-purple` | Testing, implementation       |
| pink   | `agent-icon-pink` `agent-name-pink`     | Brand, primary accent         |
| orange | `agent-icon-orange` `agent-name-orange` | Warnings, configuration       |
| red    | `agent-icon-red` `agent-name-red`       | Errors, destructive actions   |
| cyan   | `agent-icon-cyan` `agent-name-cyan`     | Data, analysis, monitoring    |
| gray   | `agent-icon-gray` `agent-name-gray`     | Logging, secondary, support   |

## Agent Line Format

Each agent line increments `--delay` for staggered animation:

```html
<div class="agent-line" style="--delay: 0">
  <span class="agent-icon agent-icon-{color}">{emoji}</span>
  <div>
    <span class="agent-name agent-name-{color}">AgentName</span>
    <span class="agent-task"> — description of what the agent is doing</span>
  </div>
</div>
```

## Animation Behavior

- `data-animate` attribute enables the full animation sequence
- **IntersectionObserver** triggers animation when 30% of the block scrolls into view
- Plays exactly once per block
- Without `data-animate`, agents use CSS-only staggered fade-in (no-JS fallback)

### Animation Sequence

1. Terminal chrome appears immediately
2. Prompt text types out character by character (25ms/char, blinking cursor)
3. If reasoning block exists: fades in, then reasoning lines appear one by one (250ms apart)
4. 400-600ms pause
5. Divider and response label fade in
6. Agent lines stagger in (180ms apart)
7. Status dots start pulsing

## Best Practices

1. **Keep prompts concise.** 1-2 sentences. Long prompts slow down the typewriter.
2. **2-4 reasoning lines.** Too many feels slow. Keep each line to one clear thought.
3. **3-5 agent lines.** More than 6 gets visually heavy.
4. **Use distinct colors** per agent. Don't repeat colors in the same block.
5. **Match the title bar** to the tool being shown (Copilot Chat vs Squad).
6. **Status text** should summarize: "Response complete", "5 agents working in parallel…", "Processing…".

## File Locations

| File                                             | Purpose                                              |
| ------------------------------------------------ | ---------------------------------------------------- |
| `src/styles/global.css`                          | All CSS classes, keyframes, colors                   |
| `src/pages/post/[...slug]/index.astro`           | Animation script (IntersectionObserver + typewriter) |
| `.github/extensions/terminal-chat/extension.mjs` | Copilot CLI extension tool for generating HTML       |
