import { User } from '@/shared/types/models';

export * from '@/shared/types/models';

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthSession = {
  accessToken: string;
  user: User;
};

export type RefreshTokenResponse = {
  accessToken: string;
};
