import { showAppFeedback, subscribeFeedback } from '../feedbackAdapter';

describe('feedbackAdapter', () => {
  it('delivers messages to every active subscriber with defaults applied', () => {
    const a = jest.fn();
    const b = jest.fn();
    subscribeFeedback(a);
    const unsubscribeB = subscribeFeedback(b);

    showAppFeedback('saved');

    const payload = { message: 'saved', duration: 3000, actionLabel: undefined, onAction: undefined };
    expect(a).toHaveBeenCalledWith(payload);
    expect(b).toHaveBeenCalledWith(payload);

    unsubscribeB();
    showAppFeedback('again', { duration: 1000, actionLabel: 'Undo' });

    expect(a).toHaveBeenLastCalledWith(
      expect.objectContaining({ message: 'again', duration: 1000, actionLabel: 'Undo' }),
    );
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('ignores empty messages', () => {
    const listener = jest.fn();
    subscribeFeedback(listener);

    showAppFeedback('');

    expect(listener).not.toHaveBeenCalled();
  });
});
