import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface IShowMoreHoursProps {
  storeHours: string[];
}

export const ShowMoreHours = ({ storeHours }: IShowMoreHoursProps) => {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const firstThreeHours = storeHours.slice(0, 3).join('; ') + ';';

  return (
    <Grid container>
      <Grid item xs={9}>
        <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
          {firstThreeHours}
        </Typography>
      </Grid>
      <Grid item xs={3} justifyContent="end">
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.2, cursor: 'pointer' }}
          color="#0047ff"
          onClick={() => setIsDialogOpen(true)}
        >
          {t('backoffice.common.showMore')}
        </Typography>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Open Hours</DialogTitle>
          <DialogContent>
            <ul id="alert-dialog-description" style={{ minWidth: '300px' }}>
              {storeHours.map((storeHour, i) => (
                <li key={i}>{storeHour}</li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
};
