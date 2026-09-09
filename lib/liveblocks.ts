import { config } from "dotenv";
import { Liveblocks } from "@liveblocks/node";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const CURSOR_COLORS = [
  "#E11D48",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
] as const;

const globalForLiveblocks = globalThis as unknown as {
  liveblocks?: Liveblocks;
};

function createLiveblocks() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
  }

  return new Liveblocks({ secret });
}

export function getLiveblocks(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = createLiveblocks();
  }

  return globalForLiveblocks.liveblocks;
}

export function cursorColorFromUserId(userId: string): string {
  let hash = 0;

  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }

  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}
