jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
}));

import { Alert } from 'react-native';
import { confirmAction } from '../confirmDialog';

/** Grabs the button list passed to the most recent Alert.alert call. */
const lastButtons = () => Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1][2];

describe('confirmAction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('resolves true when the confirm button is pressed', async () => {
    const promise = confirmAction({ title: 'Delete', confirmLabel: 'Delete', destructive: true });

    const [cancelBtn, confirmBtn] = lastButtons();
    expect(Alert.alert).toHaveBeenCalledWith('Delete', expect.any(String), expect.any(Array), {
      cancelable: true,
      onDismiss: expect.any(Function),
    });
    expect(confirmBtn.style).toBe('destructive');
    expect(cancelBtn.style).toBe('cancel');

    confirmBtn.onPress();
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false when cancelled', async () => {
    const promise = confirmAction();
    lastButtons()[0].onPress();
    await expect(promise).resolves.toBe(false);
  });
});
