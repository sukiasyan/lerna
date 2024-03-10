import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import {
  DataGridPro,
  DataGridProProps,
  GridColumnVisibilityModel,
  GridRenderCellParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid-pro';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import RetailerActionsDialog from '../RetailerActionsDialog';
import SocialMedias from '../SocialMedias';

import LocalStoreColumns from './LocalStoreColumns';
import { ShowMoreHours } from './ShowMoreHours';

import { useDeleteOrRestoreLocalStoreMutation } from '~/Store';
import { IUnityLocalStoreOverview, IUnityStatus } from '~/types/Retailers';
import LocalStoreDrawer from '~/Views/Retailers/LocalStores/LocalStoreDrawer.tsx';
import StoreDetailsDialog from '~/Views/Retailers/StoreDetailsDialog';

interface ILocalStoresTableProps {
  localStoreRows: IUnityLocalStoreOverview[];
  selectedRetailerName: string;
}

const LocalStoresCustomToolbar = () => (
  <Grid
    container
    alignItems="center"
    justifyContent="space-between"
    spacing={2}
  >
    <Grid item>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <GridToolbarFilterButton color="inherit" />
        </Grid>
      </Grid>
    </Grid>
    <Grid item>
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="inherit" />
        <GridToolbarDensitySelector color="inherit" />
        <GridToolbarExport color="inherit" />
      </GridToolbarContainer>
    </Grid>
  </Grid>
);

const DetailPanelContent = ({ row }: { row: IUnityLocalStoreOverview }) => {
  const { t } = useTranslation();

  const storeHoursArray =
    row.storeHours && row.storeHours[0] ? row.storeHours[0].split('; ') : [];
  const formattedStoreHours = storeHoursArray ? storeHoursArray.join(', ') : '';

  return (
    <Stack
      sx={{
        py: 1,
        px: 1,
        background: '#DFE6FB'
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Card sx={{ py: 2, px: 2 }}>
            <Grid container>
              <Grid item xs={2}>
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  {t('backoffice.retailers.importer.create.storeHours')}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                {storeHoursArray.length > 3 ? (
                  <ShowMoreHours storeHours={storeHoursArray} />
                ) : (
                  <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                    {formattedStoreHours || '-'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <SocialMedias socialMediaUrls={row?.socialMediaURLs} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export const LocalStoresTable = ({
  localStoreRows,
  selectedRetailerName
}: ILocalStoresTableProps) => {
  const { t } = useTranslation();
  const [deleteOrRestoreLocalStoreApi, deleteOrRestoreOnlineStoreApiQuery] =
    useDeleteOrRestoreLocalStoreMutation();

  const [isLocalStoreDrawer, setIsLocalStoreDrawer] = useState(false);
  const [mode, setMode] = useState('');
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);
  const [isRestoreButtonLoading, setIsRestoreButtonLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<IUnityStatus | null>(
    IUnityStatus.INACTIVE
  );
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<
    IUnityLocalStoreOverview | undefined
  >();
  const [selectedDataSourceRow, setSelectedDataSourceRow] = useState<
    IUnityLocalStoreOverview | undefined
  >();
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      'address.name': false,
      'address.street2': false,
      'address.city': false,
      'address.stateOrProvidence': false,
      'address.postalCode': false
    });
  const [openDataSourcesDialog, setOpenDataSourcesDialog] = useState(false);
  // const [selectedRow, setSelectedRow] = useState('');

  const handleDataSourcesClick = (dataSourceRow: IUnityLocalStoreOverview) => {
    // setSelectedRow(id);
    setSelectedDataSourceRow(dataSourceRow);
    setOpenDataSourcesDialog(true);
  };

  const handleCloseDataSourcesDialog = () => {
    setOpenDataSourcesDialog(false);
  };

  const onEditLocalStore = (id: string) => {
    const matchingRows = localStoreRows.filter((row) => row.PSRLSID === id);
    setCurrentRowId(id);
    if (matchingRows.length > 0) {
      // Set the first matching row (or handle multiple matches as needed)
      setSelectedRow(matchingRows[0]);
    }
    setMode('edit');
    setIsLocalStoreDrawer(true);
  };

  const onDeleteDialogOpen = (params: GridRenderCellParams) => {
    setCurrentRowId(String(params.id));
    setIsDeleteDialogOpen(true);
  };

  const onRestoreDialogOpen = (params: GridRenderCellParams) => {
    setCurrentRowId(String(params.id));
    setStatusValue(IUnityStatus.INACTIVE);
    setIsRestoreDialogOpen(true);
  };

  const onRestoreDialogCancel = () => {
    setIsRestoreDialogOpen(false);
    setStatusValue(null);
  };

  const onApiCall = async (status: IUnityStatus) => {
    const isLoading =
      status === IUnityStatus.DELETED
        ? setIsDeleteButtonLoading
        : setIsRestoreButtonLoading;
    const isDialogOpen =
      status === IUnityStatus.DELETED
        ? setIsDeleteDialogOpen
        : setIsRestoreDialogOpen;

    isLoading(true);
    try {
      await deleteOrRestoreLocalStoreApi({
        body: { status },
        PSRTID: localStoreRows[0].PSRTID,
        PSRLSID: String(currentRowId)
      }).unwrap();
    } catch (error) {
    } finally {
      isLoading(false);
      isDialogOpen(false);
    }
  };

  const onDeleteLocalStore = () => onApiCall(IUnityStatus.DELETED);
  const onRestoreLocalStore = () => onApiCall(statusValue!);

  useEffect(() => {
    if (deleteOrRestoreOnlineStoreApiQuery.isSuccess) {
      setIsDeleteButtonLoading(false);
      setIsDeleteDialogOpen(false);
      setIsRestoreButtonLoading(false);
      setIsRestoreDialogOpen(false);
      setStatusValue(null);
    }
  }, [deleteOrRestoreOnlineStoreApiQuery.isSuccess]);

  const getDetailPanelContent = useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => <DetailPanelContent row={row} />, []);

  const getDetailPanelHeight = useCallback<
    NonNullable<DataGridProProps['getDetailPanelHeight']>
  >(() => 'auto' as const, []);

  const localStoreColumns = LocalStoreColumns(
    onEditLocalStore,
    onDeleteDialogOpen,
    onRestoreDialogOpen,
    handleDataSourcesClick
  );

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Card>
          <DataGridPro
            columns={localStoreColumns}
            rows={localStoreRows}
            getRowId={(row) => row.PSRLSID}
            getDetailPanelContent={getDetailPanelContent}
            getDetailPanelHeight={getDetailPanelHeight}
            rowThreshold={0}
            hideFooter
            slots={{
              detailPanelExpandIcon: () => <KeyboardArrowRightIcon />,
              detailPanelCollapseIcon: () => <KeyboardArrowDownIcon />,
              toolbar: LocalStoresCustomToolbar
            }}
            unstable_headerFilters
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) =>
              setColumnVisibilityModel(newModel)
            }
          />
        </Card>
      </Box>

      <LocalStoreDrawer
        selectedRow={selectedRow}
        open={isLocalStoreDrawer}
        mode={mode}
        onClose={() => setIsLocalStoreDrawer(false)}
        onDeleteLocalStore={onDeleteLocalStore}
        selectedRetailerName={selectedRetailerName}
      />

      <RetailerActionsDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t('backoffice.retailers.importer.delete.delete1pStore')}
        actions={
          <>
            <Button
              color="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="text"
            >
              {t('backoffice.common.noCancel')}
            </Button>
            <LoadingButton
              color="error"
              autoFocus
              onClick={onDeleteLocalStore}
              variant="contained"
              loading={isDeleteButtonLoading}
            >
              {t('backoffice.common.yesDelete')}
            </LoadingButton>
          </>
        }
      >
        <Typography variant="body1" color="text.secondary">
          {t('backoffice.retailers.importer.delete.delete1pStoreMessage')}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontWeight: 'bold', mt: 2 }}
        >
          {t(
            'backoffice.retailers.importer.delete.delete1pStoreConfirmMessage'
          )}
        </Typography>
      </RetailerActionsDialog>

      <RetailerActionsDialog
        open={isRestoreDialogOpen}
        onClose={onRestoreDialogCancel}
        title={t('backoffice.retailers.importer.restore.restore1pStore')}
        actions={
          <>
            <Button
              color="secondary"
              onClick={onRestoreDialogCancel}
              variant="text"
            >
              {t('backoffice.common.cancel')}
            </Button>
            <LoadingButton
              disabled={
                statusValue !== IUnityStatus.ACTIVE &&
                statusValue !== IUnityStatus.INACTIVE &&
                statusValue !== null
              }
              autoFocus
              onClick={onRestoreLocalStore}
              variant="contained"
              loading={isRestoreButtonLoading}
            >
              {t('backoffice.common.restore')}
            </LoadingButton>
          </>
        }
      >
        <Typography variant="body1" color="text.secondary">
          {t('backoffice.retailers.importer.restore.restoreStoreMessage')}
        </Typography>
        <Stack marginTop={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={(event) => {
                    setStatusValue(
                      event.target.checked
                        ? IUnityStatus.ACTIVE
                        : IUnityStatus.INACTIVE
                    );
                  }}
                />
              }
              label={t('backoffice.retailers.importer.create.setActive')}
            />
          </FormGroup>
        </Stack>
      </RetailerActionsDialog>
      <StoreDetailsDialog
        openDataSourcesDialog={openDataSourcesDialog}
        handleCloseDialog={handleCloseDataSourcesDialog}
        selectedDataSourceRow={selectedDataSourceRow}
        storeType="local"
      />
    </>
  );
};

export default LocalStoresTable;
