import { Alert } from 'react-native';

/**
 * Shows a native confirmation dialog and resolves with the user's choice.
 *
 * Lives in the shared feedback layer (not in a store) so state modules stay
 * free of UI concerns.
 *
 * @param {{ title?: string, message?: string, confirmLabel?: string, cancelLabel?: string, destructive?: boolean }} [options]
 * @returns {Promise<boolean>} Resolves true when confirmed, false when cancelled.
 */
export const confirmAction = ({
  title = 'Please confirm',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
} = {}) =>
  new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
        {
          text: confirmLabel,
          style: destructive ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
