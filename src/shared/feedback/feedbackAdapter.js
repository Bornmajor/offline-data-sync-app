const DEFAULT_DURATION = 3000;

const listeners = new Set();

/**
 * Subscribes to app feedback events.
 * @param {(event: { message: string, duration?: number, actionLabel?: string, onAction?: () => void }) => void} listener
 * @returns {() => void}
 */
export const subscribeFeedback = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Emits a feedback event consumed by the global snackbar.
 * @param {string} message
 * @param {{ duration?: number, actionLabel?: string, onAction?: () => void }} [options]
 */
export const showAppFeedback = (message, options = {}) => {
  if (!message) {
    return;
  }

  const payload = {
    message,
    duration: options.duration ?? DEFAULT_DURATION,
    actionLabel: options.actionLabel,
    onAction: options.onAction,
  };

  listeners.forEach((listener) => listener(payload));
};
