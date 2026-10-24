import { OfflineDraftReport, RateLimitStatus } from '../types/civic';

const RATE_LIMIT_KEY = 'civicfix_submission_timestamps';
const DRAFT_KEY = 'civicfix_draft_report';
const OFFLINE_QUEUE_KEY = 'civicfix_offline_queue';

const MAX_REPORTS_ALLOWED = 3;
const WINDOW_MINUTES = 5;

/**
 * Checks if the current client is within the submission rate limit.
 */
export function checkRateLimit(): RateLimitStatus {
  if (typeof window === 'undefined') {
    return {
      allowed: true,
      reportsSubmittedInWindow: 0,
      maxReportsAllowed: MAX_REPORTS_ALLOWED,
      windowMinutes: WINDOW_MINUTES,
      secondsRemaining: 0,
    };
  }

  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const windowMs = WINDOW_MINUTES * 60 * 1000;
    const now = Date.now();

    // Filter to submissions within the window
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= MAX_REPORTS_ALLOWED) {
      const oldestInWindow = recent[0];
      const expiry = oldestInWindow + windowMs;
      const secondsRemaining = Math.max(0, Math.ceil((expiry - now) / 1000));

      return {
        allowed: false,
        reportsSubmittedInWindow: recent.length,
        maxReportsAllowed: MAX_REPORTS_ALLOWED,
        windowMinutes: WINDOW_MINUTES,
        secondsRemaining,
      };
    }

    return {
      allowed: true,
      reportsSubmittedInWindow: recent.length,
      maxReportsAllowed: MAX_REPORTS_ALLOWED,
      windowMinutes: WINDOW_MINUTES,
      secondsRemaining: 0,
    };
  } catch {
    return {
      allowed: true,
      reportsSubmittedInWindow: 0,
      maxReportsAllowed: MAX_REPORTS_ALLOWED,
      windowMinutes: WINDOW_MINUTES,
      secondsRemaining: 0,
    };
  }
}

/**
 * Records a successful report submission for rate limiting.
 */
export function recordSubmission(): void {
  if (typeof window === 'undefined') return;

  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const windowMs = WINDOW_MINUTES * 60 * 1000;
    const now = Date.now();

    const recent = timestamps.filter((t) => now - t < windowMs);
    recent.push(now);

    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  } catch (err) {
    console.error('Failed to update rate limit timestamps:', err);
  }
}

/**
 * Saves report form draft to localStorage for offline protection.
 */
export function saveDraftReport(draft: OfflineDraftReport): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (err) {
    console.error('Failed to save draft:', err);
  }
}

/**
 * Retrieves the stored offline draft if present.
 */
export function loadDraftReport(): OfflineDraftReport | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clears saved draft report.
 */
export function clearDraftReport(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error('Failed to clear draft:', err);
  }
}

/**
 * Queues a full report while offline for auto-sync when connection returns.
 */
export function queueOfflineReport(report: any): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(report);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to queue offline report:', err);
  }
}

/**
 * Retrieves queued offline reports.
 */
export function getQueuedOfflineReports(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clears queued offline reports.
 */
export function clearQueuedOfflineReports(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch (err) {
    console.error('Failed to clear offline queue:', err);
  }
}
