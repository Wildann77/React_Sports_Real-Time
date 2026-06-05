import { ReactNode, useEffect } from 'react';
import { getMe, refreshToken } from '../api/auth';
import { useAuthStore } from '../stores/auth-store';

let initPromise: Promise<void> | null = null;

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const setAuthReady = useAuthStore((state) => state.setAuthReady);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (initPromise) {
        await initPromise;
        return;
      }

      initPromise = (async () => {
        try {
          const currentAccessToken = useAuthStore.getState().accessToken;

          if (currentAccessToken) {
            const user = await getMe();
            const latestAccessToken = useAuthStore.getState().accessToken ?? currentAccessToken;
            useAuthStore.getState().setAuth({ accessToken: latestAccessToken, user });
            return;
          }

          const refreshResponse = await refreshToken();
          const nextAccessToken = refreshResponse.data?.accessToken;

          if (!nextAccessToken) {
            throw new Error('No access token returned from refresh.');
          }

          useAuthStore.getState().setAccessToken(nextAccessToken);
          const user = await getMe();

          useAuthStore.getState().setAuth({ accessToken: nextAccessToken, user });
        } catch (error) {
          initPromise = null;
          useAuthStore.getState().clearAuth();
          throw error;
        }
      })();

      await initPromise;
    };

    void initializeAuth()
      .catch(() => {
        // Ignored, errors are handled in the initPromise catch block
      })
      .finally(() => {
        if (isMounted) {
          setAuthReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setAuthReady]);

  return <>{children}</>;
}

