import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import WarningIcon from '@mui/icons-material/Warning';
import { SvgIconProps, useTheme } from '@mui/material';
import { CSSProperties, forwardRef } from 'react';

type Severity = 'error' | 'warning' | 'info' | 'success' | 'inactive';

interface ISeverityIconProps extends SvgIconProps {
  severity?: Severity;
}

const useInlineStyle = (severity?: Severity): CSSProperties => {
  const { palette } = useTheme();

  if (severity === undefined || severity === 'inactive') {
    return { color: palette.text.disabled };
  }

  return { color: palette[severity].main };
};

export const SeverityIcon = forwardRef<SVGSVGElement, ISeverityIconProps>(
  ({ severity, ...rest }, ref) => {
    const style = useInlineStyle(severity);

    if (severity === 'error') {
      return <ErrorIcon ref={ref} style={style} {...rest} />;
    }

    if (severity === 'warning') {
      return <WarningIcon ref={ref} style={style} {...rest} />;
    }

    if (severity === 'info') {
      return <InfoIcon ref={ref} style={style} {...rest} />;
    }

    if (severity === 'success') {
      return <CheckCircleIcon ref={ref} style={style} {...rest} />;
    }

    if (severity === 'inactive' || severity === undefined) {
      return <PowerOffIcon ref={ref} style={style} {...rest} />;
    }

    return <HelpIcon ref={ref} style={style} {...rest} />;
  }
);
