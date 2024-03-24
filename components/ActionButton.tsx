import { Button, ButtonProps } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';

export type ActionButtonProps = {
  action: () => Promise<string>
  onComplete?: () => void
  onError?: (e: Error) => void
  successLabel: string
  errorLabel?: string
  buttonProps?: ButtonProps
  children?: React.ReactNode
};

export function ActionButton({ action, onComplete, onError, buttonProps, successLabel, errorLabel, children }: ActionButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      const res = await action();

      notifications.show({ title: successLabel, message: res, color: 'green' });
      console.log(successLabel, res);
      onComplete?.();
    } catch (error: any) {
      console.error(errorLabel || 'Action failed', error);
      notifications.show({ title: errorLabel || 'Action failed', message: error.message, color: 'red' });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };
  return <Button {...buttonProps} onClick={handleAction} loading={loading}>{children}</Button>;
}
