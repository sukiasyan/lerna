import { Chip } from '@mui/material';
import clsx from 'clsx';

import { Severity, StyledChip } from './SeverityChip.styles';

interface ISeverityChipProps
  extends Omit<React.ComponentProps<typeof Chip>, 'classes'> {
  severity?: Severity;
}

export const SeverityChip = ({
  severity,
  className,
  ...props
}: ISeverityChipProps) => (
  <StyledChip severity={severity} className={clsx(className)} {...props} />
);
