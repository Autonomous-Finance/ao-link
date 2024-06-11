export const truncateId = (text: string) => {
  if (!text || text.length <= 16) return text
  return text.slice(0, 8) + "..." + text.slice(-8)
}

export function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export const TYPE_ICON_MAP: Record<string, any> = {
  Process: "/process.svg",
  Message: "/message.svg",
  Module: "/article.svg",
}

export const TYPE_COLOR_MAP: Record<string, string> = {
  Module: "#d1b8e0",
  Assignment: "#e0b8b8",
  Checkpoint: "#80deea",
  Process: "#B8C3E0",
  Message: "#E2F0DC",
  Owner: "#FFADAD",
  Block: "#FEEEE5",
  Entity: "#9EA2AA",
  Token: "#ffeb84",
}

export const TYPE_PATH_MAP: Record<string, string> = {
  Module: "module",
  Assignment: "message",
  Checkpoint: "message",
  Process: "entity",
  Message: "message",
  Owner: "entity",
  Block: "block",
  Entity: "entity",
  Token: "token",
}
