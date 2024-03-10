import { alpha, Chip, styled } from '@mui/material';

export type Severity = 'error' | 'warning' | 'info' | 'success' | 'primary';

interface StyleProps {
  severity: Severity | undefined;
}

export const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'severity'
})<StyleProps>(({ theme, severity }) => ({
  backgroundColor: severity
    ? alpha(theme.palette[severity].main, 0.08)
    : theme.palette.grey[100],
  color: severity ? theme.palette[severity].main : undefined,
  borderColor: severity ? theme.palette[severity].main : undefined
}));
