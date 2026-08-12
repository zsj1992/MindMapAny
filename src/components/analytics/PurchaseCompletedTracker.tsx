'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

const SESSION_KEY = 'mindmapany:purchase-completed-tracked';

/**
 * This is a marketing attribution signal for reaching the Creem success return page.
 * Subscription fulfillment and revenue truth remain server-side in the signed webhook.
 */
export function PurchaseCompletedTracker() {
  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    window.sessionStorage.setItem(SESSION_KEY, '1');
    trackEvent('purchase_completed', { provider: 'creem', source: 'success_return' });
  }, []);

  return null;
}
