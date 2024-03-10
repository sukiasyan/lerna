import { Card, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const DrawerTitleCard = ({
  selectedRetailerName
}: {
  selectedRetailerName: string | null;
}) => {
  // Aliases
  const { t } = useTranslation();

  return (
    <Stack sx={{ pb: 2, pt: 2 }}>
      <Card
        sx={{
          background: '#fafafa',
          display: 'flex',
          padding: '8px 16px',
          flexDirection: 'column',
          boxShadow: 'none'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('backoffice.common.retailer')}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {selectedRetailerName}
        </Typography>
      </Card>
    </Stack>
  );
};

export default DrawerTitleCard;
