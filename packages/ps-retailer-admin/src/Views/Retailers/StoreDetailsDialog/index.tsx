import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

import { IUnityLocalStoreOverview } from '~/types/Retailers';
import DataSourcesTable from '~/Views/Retailers/StoreDetailsDialog/DataSourcesTable.tsx';

const StoreDetailsDialog = ({
  openDataSourcesDialog,
  handleCloseDialog,
  selectedDataSourceRow,
  storeType
}: {
  openDataSourcesDialog: boolean;
  handleCloseDialog: () => void;
  selectedDataSourceRow?: IUnityLocalStoreOverview;
  storeType: string;
}) => {
  //Aliases
  const { t } = useTranslation();

  if (!selectedDataSourceRow) {
    return <></>;
  }

  return (
    <Dialog
      open={openDataSourcesDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          width: 1000,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      }}
    >
      <DialogTitle>
        {storeType === 'local'
          ? t('backoffice.retailers.importer.create.localStoreDataSources')
          : t('backoffice.retailers.importer.create.onlineStoreDataSources')}

        <IconButton
          onClick={handleCloseDialog}
          size="large"
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box paddingBottom={3}>
          <Typography variant="body2" color="secondary">
            {t('backoffice.retailers.importer.create.storeName')}
          </Typography>
          <Typography variant="body1">{selectedDataSourceRow.name}</Typography>
        </Box>
        {selectedDataSourceRow.dataSources && (
          <DataSourcesTable dataSources={selectedDataSourceRow.dataSources} />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCloseDialog} variant="text">
          {t('backoffice.common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreDetailsDialog;
