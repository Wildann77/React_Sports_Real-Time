export const MatchStatusEnum = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  FINISHED: "finished",
} as const;

export type MatchStatus = (typeof MatchStatusEnum)[keyof typeof MatchStatusEnum];

export const CommentaryEventTypeEnum = {
  GOAL: "goal",
  YELLOW_CARD: "yellow-card",
  RED_CARD: "red-card",
  HALF_TIME: "half_time",
  FULL_TIME: "full_time",
  SUBSTITUTION: "substitution",
  INFO: "info",
} as const;

export type CommentaryEventType = (typeof CommentaryEventTypeEnum)[keyof typeof CommentaryEventTypeEnum];

export type User = {
  id: number;
  email: string;
};

export type Match = {
  id: number;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  endTime: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type CommentaryPayload = {
  homeScore?: number;
  awayScore?: number;
  [key: string]: unknown;
};

export type Commentary = {
  id: number;
  matchId: number;
  minute: number;
  eventType: CommentaryEventType;
  message: string;
  payload: CommentaryPayload | null;
  createdAt: string;
};

export type MatchListMeta = {
  page: number;
  limit: number;
  count: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export const ApiKeyScopeEnum = {
  MATCHES_WRITE: "matches:write",
  COMMENTARY_WRITE: "commentary:write",
} as const;

export type ApiKeyScope = (typeof ApiKeyScopeEnum)[keyof typeof ApiKeyScopeEnum];

export type ApiKey = {
  id: number;
  userId: number;
  name: string;
  keyPrefix: string;
  keyLastFour: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateApiKeyResponse = {
  apiKey: string;
  key: ApiKey;
};

