import { useEffect, useState } from 'react';
import { wsClient } from '../lib/websocket';

export function useWsStatus() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'reconnecting'>(
    () => wsClient.getConnectionState()
  );

  useEffect(() => {
    const unsubscribe = wsClient.subscribe((event) => {
      if (event.type === 'connection.state') {
        setStatus(event.state);
      }
    });

    return unsubscribe;
  }, []);

  return status;
}
