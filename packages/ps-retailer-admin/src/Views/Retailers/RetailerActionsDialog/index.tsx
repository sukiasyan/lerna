import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';

interface IRetailerActionsDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  actions: React.ReactNode;
}

const RetailerActionsDialog = ({
  title,
  open,
  onClose,
  children,
  actions
}: IRetailerActionsDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          width: 450,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 8
        }
      }}
    >
      <DialogTitle>
        {title}
        <IconButton
          onClick={onClose}
          size="large"
          style={{ position: 'absolute', top: 12, right: 16 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default RetailerActionsDialog;
