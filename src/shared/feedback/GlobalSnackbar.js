import React, { useEffect, useState } from 'react';
import { Portal, Snackbar } from 'react-native-paper';
import { subscribeFeedback } from './feedbackAdapter';

/**
 * Renders global snackbar feedback for all platforms.
 */
const GlobalSnackbar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(3000);
  const [actionLabel, setActionLabel] = useState(undefined);
  const [onAction, setOnAction] = useState(undefined);

  useEffect(() => {
    const unsubscribe = subscribeFeedback((event) => {
      setMessage(event.message);
      setDuration(event.duration ?? 3000);
      setActionLabel(event.actionLabel);
      setOnAction(() => event.onAction);
      setVisible(true);
    });

    return unsubscribe;
  }, []);

  const dismiss = () => setVisible(false);

  return (
    <Portal>
      <Snackbar
        visible={visible}
        duration={duration}
        onDismiss={dismiss}
        action={
          actionLabel
            ? {
                label: actionLabel,
                onPress: () => {
                  if (typeof onAction === 'function') {
                    onAction();
                  }
                  dismiss();
                },
              }
            : undefined
        }
      >
        {message}
      </Snackbar>
    </Portal>
  );
};

export default GlobalSnackbar;
