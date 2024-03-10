import { styled } from '@mui/material';

export const CustomFlag = styled('span')(() => ({
  width: '1em',
  height: '1em',
  display: 'inline-block',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
  // background: theme.palette.grey[400]
}));
