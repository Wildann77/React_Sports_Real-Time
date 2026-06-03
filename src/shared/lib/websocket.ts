import { Commentary, MatchStatus } from '@/shared/types/models';
import { env } from './env';

export type WelcomeEvent = {
  type: 'welcome';
  data: {
    clientId: string;
    serverTime: string;
    version: string;
  };
};
export type SubscribedEvent = { type: 'subscribed'; matchId: number };
export type CommentaryCreatedEvent = {
  type: 'commentary.created';
  matchId: number;
  data: Commentary;
};
export type MatchUpdatedEvent = {
  type: 'match.updated';
  matchId: number;
  data: {
    homeScore: number;
    awayScore: number;
    status: MatchStatus;
  };
};
export type WebSocketErrorEvent = { type: 'error'; message: string };
export type UnsubscribedEvent = { type: 'unsubscribed'; matchId: number };
export type PongEvent = { type: 'pong' };

type OutboundMessage =
  | { type: 'subscribe'; matchId: number }
  | { type: 'unsubscribe'; matchId: number }
  | { type: 'ping' };

export type ConnectionStateEvent = {
  type: 'connection.state';
  state: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
};

export type WebSocketEvent =
  | WelcomeEvent
  | SubscribedEvent
  | UnsubscribedEvent
  | PongEvent
  | CommentaryCreatedEvent
  | MatchUpdatedEvent
  | WebSocketErrorEvent
  | ConnectionStateEvent;

type Listener = (event: WebSocketEvent) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url = env.WS_URL;
  private listeners = new Set<Listener>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private isConnecting = false;
  private pingInterval: number | null = null;
  private shouldReconnect = true;
  private subscribedMatches = new Set<number>();
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' = 'disconnected';

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.shouldReconnect = true;
    this.isConnecting = true;
    this.setConnectionState(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.setConnectionState('connected');
      this.startPing();
      this.resubscribeAll();
    };

    this.ws.onmessage = (event) => {
      if (typeof event.data !== 'string') return;

      if (import.meta.env.DEV) {
        console.log('[WebSocket] Raw message received:', event.data);
      }

      // Pisahkan berdasarkan newline (\n) untuk menangani batching pesan dari server
      const lines = event.data.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        try {
          const parsed = JSON.parse(trimmedLine) as WebSocketEvent;
          if (import.meta.env.DEV) {
            console.log('[WebSocket] Parsed event:', parsed);
          }
          this.notifyListeners(parsed);
        } catch (parseError) {
          // Fallback: Jika gagal parse per baris (mungkin ada newline di dalam field string),
          // dan hanya ada 1 baris utuh asli, coba parse data aslinya secara penuh sebagai fallback.
          if (lines.length === 1) {
            try {
              const parsed = JSON.parse(event.data) as WebSocketEvent;
              if (import.meta.env.DEV) {
                console.log('[WebSocket] Parsed event (fallback):', parsed);
              }
              this.notifyListeners(parsed);
              return;
            } catch (innerError) {
              // Abaikan
            }
          }
          if (import.meta.env.DEV) {
            console.error('Failed to parse WS line:', trimmedLine, parseError);
          }
        }
      }
    };

    this.ws.onclose = () => {
      this.isConnecting = false;
      this.stopPing();
      this.ws = null;

      if (this.shouldReconnect && this.subscribedMatches.size > 0) {
        this.setConnectionState('reconnecting');
        this.handleReconnect();
      } else {
        this.setConnectionState('disconnected');
      }
    };

    this.ws.onerror = (error) => {
      if (import.meta.env.DEV) {
        console.error('WebSocket error:', error);
      }
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    this.stopPing();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setConnectionState('disconnected');
  }

  resetAndConnect() {
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connect();
  }

  subscribeMatch(matchId: number) {
    this.subscribedMatches.add(matchId);
    this.send({ type: 'subscribe', matchId });
  }

  unsubscribeMatch(matchId: number) {
    this.subscribedMatches.delete(matchId);
    this.send({ type: 'unsubscribe', matchId });

    if (this.subscribedMatches.size === 0) {
      this.disconnect();
    }
  }

  sendPing() {
    this.send({ type: 'ping' });
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    // Send current connection state immediately to new subscriber
    listener({ type: 'connection.state', state: this.connectionState });
    return () => {
      this.listeners.delete(listener);
    };
  }

  getConnectionState() {
    return this.connectionState;
  }

  private setConnectionState(state: 'disconnected' | 'connecting' | 'connected' | 'reconnecting') {
    this.connectionState = state;
    this.notifyListeners({ type: 'connection.state', state });
  }

  private send(message: OutboundMessage) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }

    this.ws.send(JSON.stringify(message));
  }

  private resubscribeAll() {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return;
    }

    this.subscribedMatches.forEach((matchId) => {
      this.ws?.send(JSON.stringify({ type: 'subscribe', matchId }));
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setConnectionState('disconnected');
      return;
    }

    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    window.setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPing() {
    this.stopPing();
    this.pingInterval = window.setInterval(() => {
      this.sendPing();
    }, 30000);
  }

  private stopPing() {
    if (this.pingInterval !== null) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private notifyListeners(event: WebSocketEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const wsClient = new WebSocketClient();

