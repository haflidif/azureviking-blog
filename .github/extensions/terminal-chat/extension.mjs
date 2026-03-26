import { joinSession } from "@github/copilot-sdk/extension";

const COLORS = ["yellow", "blue", "green", "purple", "pink", "orange", "red", "cyan", "gray"];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildAgentLine(agent, index) {
  const color = COLORS.includes(agent.color) ? agent.color : "gray";
  return [
    `    <div class="agent-line" style="--delay: ${index}">`,
    `      <span class="agent-icon agent-icon-${color}">${agent.emoji}</span>`,
    `      <div>`,
    `        <span class="agent-name agent-name-${color}">${escapeHtml(agent.name)}</span>`,
    `        <span class="agent-task"> — ${escapeHtml(agent.task)}</span>`,
    `      </div>`,
    `    </div>`,
  ].join("\n");
}

function generateTerminalChat({ title, prompt, responseLabel, agents, statusText }) {
  const windowTitle = title || "Terminal";
  const label = responseLabel || "RESPONSE";
  const agentCount = agents?.length || 0;
  const status = statusText || (agentCount > 0 ? `${agentCount} agent${agentCount !== 1 ? "s" : ""} working in parallel…` : "Processing…");

  const agentLines = (agents || []).map((a, i) => buildAgentLine(a, i)).join("\n");

  return `<div class="terminal-chat" data-animate>
  <div class="terminal-chat-glow"></div>
  <div class="terminal-chat-inner">
    <div class="terminal-chat-header">
      <div class="terminal-chat-dots"><span></span><span></span><span></span></div>
      <span class="terminal-chat-title">${escapeHtml(windowTitle)}</span>
    </div>
    <div class="terminal-chat-body">
      <div>
        <p class="terminal-chat-label">YOU</p>
        <p class="terminal-chat-prompt">${escapeHtml(prompt)}</p>
      </div>
      <hr class="terminal-chat-divider">
      <div class="terminal-chat-response">
        <p class="terminal-chat-label">${escapeHtml(label)}</p>
        <div class="terminal-chat-agents">
${agentLines}
        </div>
      </div>
      <div class="terminal-chat-status">
        <div class="terminal-chat-status-dots"><span></span><span></span><span></span></div>
        <span class="terminal-chat-status-text">${escapeHtml(status)}</span>
      </div>
    </div>
  </div>
</div>`;
}

const session = await joinSession({
  tools: [
    {
      name: "generate_terminal_chat",
      description: [
        "Generates an animated terminal chat HTML block for blog posts.",
        "The output uses CSS classes from global.css (.terminal-chat, .agent-line, etc.).",
        "Paste the output directly into any .md or .mdx blog post.",
        "Supports staggered agent-line animations and a pulsing status indicator.",
        "Available agent colors: yellow, blue, green, purple, pink, orange, red, cyan, gray.",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Terminal window title shown in the header bar. Default: 'Terminal'",
          },
          prompt: {
            type: "string",
            description: "The user's message displayed in the terminal prompt section.",
          },
          responseLabel: {
            type: "string",
            description: "Label for the response section. Default: 'RESPONSE'",
          },
          agents: {
            type: "array",
            description: "Array of agent entries shown as animated lines in the response.",
            items: {
              type: "object",
              properties: {
                name:  { type: "string", description: "Agent display name (e.g. 'Flight', 'EECOM')" },
                emoji: { type: "string", description: "Emoji icon for the agent (e.g. '🏗️', '⚛️')" },
                color: { type: "string", description: "Color theme: yellow, blue, green, purple, pink, orange, red, cyan, gray" },
                task:  { type: "string", description: "Description of what the agent is doing" },
              },
              required: ["name", "emoji", "color", "task"],
            },
          },
          statusText: {
            type: "string",
            description: "Status bar text at the bottom. Default: auto-generated from agent count.",
          },
        },
        required: ["prompt"],
      },
      handler: async (args) => {
        const html = generateTerminalChat(args);
        await session.log("Terminal chat HTML generated — paste into your .md post", { level: "info" });
        return html;
      },
    },
  ],
});
