import { Alert, AlertProps, AlertTitle } from '@mui/material';

import { ERROR_STATUS_DICTIONARY, ErrorStatus } from '~/utils/errors.ts';

export interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  error: unknown;
}

export const ErrorAlert = ({ error, ...rest }: ErrorAlertProps) => {
  if (typeof error !== 'object' || error === null) {
    return null;
  }

  const { name, status, message } = error as Record<string, unknown>;

  return (
    <Alert severity="error" {...rest}>
      <AlertTitle>
        {String(
          name ||
            ERROR_STATUS_DICTIONARY[status as ErrorStatus] ||
            status ||
            'Unknown error'
        )}
      </AlertTitle>

      {String(message || 'Something went wrong')}
    </Alert>
  );
};
