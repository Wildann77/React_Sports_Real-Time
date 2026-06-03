export const QueryKeys = {
  matches: ["matches"],
  matchesByFilter: (filter: Record<string, string | number | boolean | undefined>) => ["matches", filter],
  matchDetail: (id: number) => ["matches", id],
  matchCommentary: (id: number) => ["matches", id, "commentary"],
  me: ["me"],
  apiKeys: ["apiKeys"],
} as const;
