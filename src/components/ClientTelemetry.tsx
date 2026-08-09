'use client';

import { useEffect } from 'react';

export function ClientTelemetry() {
  useEffect(() => {
    const send = (payload: Record<string, unknown>) => {
      const body = JSON.stringify({ ...payload, path: location.pathname, at: new Date().toISOString() });
      navigator.sendBeacon('/api/client-events', new Blob([body], { type: 'application/json' }));
    };
    const onError = (event: ErrorEvent) => send({ type: 'window_error', message: event.message.slice(0, 500) });
    const onRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
      send({ type: 'unhandled_rejection', message: message.slice(0, 500) });
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);
  return null;
}
