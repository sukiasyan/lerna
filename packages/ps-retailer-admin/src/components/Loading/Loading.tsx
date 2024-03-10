import { LinearProgress } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { CSSProperties } from 'react';

const circularStyle = { width: '55px', height: '55px' };

function DetermineValue(
  currentValue?: number,
  maxvalue?: number
): number | undefined {
  if (currentValue && maxvalue) {
    return (currentValue / maxvalue) * 100;
  }

  return 0;
}

export function Loading(props: {
  linear?: boolean;
  determinate?: boolean;
  currentValue?: number;
  maxValue?: number;
  relative?: boolean;
  center?: boolean;
}): JSX.Element {
  const { linear, determinate, currentValue, maxValue, relative, center } =
    props;

  const outerStyle = {
    position: relative ? 'relative' : 'absolute',
    top: '47%',
    left: '49%'
  } as CSSProperties;

  // This requires the parent element to have display: grid;
  const outerStyleRelative = {
    margin: 'auto'
  } as CSSProperties;

  if (center) {
    outerStyleRelative.marginLeft = '50%';
    outerStyleRelative.marginTop = '3%';
  }

  if (linear) {
    return <LinearProgress sx={{ width: '100%' }} />;
  }

  return (
    <div style={relative ? outerStyleRelative : outerStyle}>
      <CircularProgress
        value={determinate ? DetermineValue(currentValue, maxValue) : undefined}
        style={circularStyle}
      />
    </div>
  );
}
