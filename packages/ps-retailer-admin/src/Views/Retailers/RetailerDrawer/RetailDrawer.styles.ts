import { styled } from '@mui/material/styles';

export const DrawerContainerStyled = styled('div')({
  height: '100vh',
  padding: '4.5rem 0 4.375rem',
  position: 'relative',

  'header, footer': {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    left: 0,
    padding: '1rem',
    position: 'absolute',
    right: 0,
    width: '100%',
    zIndex: 1
  },
  header: {
    top: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    width: 'auto',

    h5: {
      margin: 0
    }
  },
  footer: {
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    bottom: 0,
    width: 'auto'
  }
});

export const DrawerContentStyled = styled('div')({
  height: 'calc(100vh - 8.875rem)',
  overflow: 'scroll',
  position: 'relative'
});
