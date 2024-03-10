import { Drawer } from '@mui/material';
import { PropsWithChildren } from 'react';

const DRAWER_WIDTH = 400;

export interface IDrawerWrapperProps {
  open?: boolean;
  children?: JSX.Element;
}

export const DrawerWrapper = ({
  children,
  open
}: PropsWithChildren<IDrawerWrapperProps>) => (
  <Drawer
    anchor="right"
    open={open}
    sx={{
      width: DRAWER_WIDTH,
      '& .MuiDrawer-paper': {
        width: DRAWER_WIDTH
      }
    }}
  >
    {children}
  </Drawer>
);
