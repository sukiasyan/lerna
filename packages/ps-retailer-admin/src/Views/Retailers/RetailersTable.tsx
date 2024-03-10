import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import {
  DataGridPro,
  GridFilterModel,
  GridRenderCellParams,
  GridSortModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid-pro';
import { Loading } from '@pricespider-neuintel/mesh';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import RetailerActionsDialog from './RetailerActionsDialog';

import { ErrorAlert } from '~/components/Error/ErrorAlert.tsx';
import {
  useDeleteOrRestoreRetailerMutation,
  useGetRetailersQuery
} from '~/Store';
import { IUnityRetailer, IUnityStatus } from '~/types/Retailers';

import RetailersColumns from '~/Views/Retailers/RetailersColumns';
import { RetailersComponentStyled } from '~/Views/Retailers/RetailersStyles.tsx';

export default function RetailersTable() {
  //Aliases
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Local State
  const [retailersData, setRetailersData] = useState<IUnityRetailer[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<IUnityStatus | null>(null);
  const [currentRowId, setCurrentRowId] = useState<string | null>(null);

  const [paginationModel, setPaginationModel] = useState<{
    pageSize: number;
    page: number;
    sortModel?: { columnName: string; direction: 'asc' | 'desc' }[];
  }>({
    pageSize: 25,
    page: 0
    // sortModel: []
  });
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: []
  });
  const [sortModel, setSortModel] = useState<GridSortModel>();

  const { data, isLoading, isError, error } = useGetRetailersQuery({
    filters: filterModel.items.filter((item) => item.value), // Prevent sending empty values
    sort: {
      columnName: sortModel?.[0]?.field ?? 'name',
      direction:
        (sortModel?.[0]?.sort ?? 'asc').charAt(0).toUpperCase() +
        (sortModel?.[0]?.sort ?? 'asc').slice(1) // Capitalize first letter ?? 'Asc'
    },
    limit: paginationModel.pageSize,
    offset: paginationModel.page * paginationModel.pageSize
  });

  const [deleteOrRestoreRetailerApi, deleteOrRestoreRetailerApiQuery] =
    useDeleteOrRestoreRetailerMutation();

  const onDeleteDialogOpen = (params: GridRenderCellParams) => {
    setCurrentRowId(String(params.id));
    setIsDeleteDialogOpen(true);
  };

  const onRestoreDialogOpen = (params: GridRenderCellParams) => {
    setCurrentRowId(String(params.id));
    setIsRestoreDialogOpen(true);
  };

  const onRestoreDialogCancel = () => {
    setIsRestoreDialogOpen(false);
    setStatusValue(null);
  };

  const onDeleteRetailer = async () => {
    await deleteOrRestoreRetailerApi({
      body: { status: statusValue ?? IUnityStatus.DELETED },
      PSRTID: String(currentRowId)
    }).unwrap();
  };

  const onRestoreRetailer = async () => {
    await deleteOrRestoreRetailerApi({
      body: { status: statusValue ?? IUnityStatus.INACTIVE },
      PSRTID: String(currentRowId)
    }).unwrap();
  };

  function CustomToolbar() {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Grid item sx={{ m: 1 }}>
          <Grid container alignItems="center" spacing={1}>
            {/*<Grid item>*/}
            {/*  <Switch />*/}
            {/*</Grid>*/}
            {/*<Grid item>Group By Organizations</Grid>*/}
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
  }

  useEffect(() => {
    if (deleteOrRestoreRetailerApiQuery.isSuccess) {
      // handleOpenSnackbar('success');
      setIsRestoreDialogOpen(false);
      setIsDeleteDialogOpen(false);
      setStatusValue(null);
    }
  }, [deleteOrRestoreRetailerApiQuery.isSuccess, navigate]);

  useEffect(() => {
    if (data) {
      setRetailersData(data?.items);
    }
  }, [data]);

  const CustomNoRowsOverlay = () => {
    return <Box sx={{ mt: 1 }}>No Rows</Box>;
  };

  const col = useMemo(() => {
    return RetailersColumns(
      t,
      navigate,
      onDeleteDialogOpen,
      onRestoreDialogOpen,
      setFilterModel
    );
  }, [navigate, t]);

  if (isLoading || !data) {
    return (
      <RetailersComponentStyled>
        <Loading />
      </RetailersComponentStyled>
    );
  }

  if (isError) {
    return <ErrorAlert error={error} />;
  }

  return (
    <Card>
      <>
        <DataGridPro
          rows={retailersData}
          columns={col}
          rowCount={data?.totalCount ?? 0}
          getRowId={(row) => row.PSRTID}
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar, noRowsOverlay: CustomNoRowsOverlay }}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={(newFilterModel) =>
            setFilterModel(newFilterModel)
          }
          sortingMode="server"
          onSortModelChange={setSortModel}
          paginationModel={paginationModel}
          onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
          pagination
          paginationMode="server"
          unstable_headerFilters
        />

        <RetailerActionsDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          title={t('backoffice.retailers.importer.delete.deleteRetailer')}
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
                onClick={onDeleteRetailer}
                variant="contained"
                loading={deleteOrRestoreRetailerApiQuery.isLoading}
              >
                {t('backoffice.common.yesDelete')}
              </LoadingButton>
            </>
          }
        >
          <Typography variant="body1" color="text.secondary">
            {t('backoffice.retailers.importer.delete.deleteRetailerMessage')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 'bold', mt: 2 }}
          >
            {t(
              'backoffice.retailers.importer.delete.deleteRetailerConfirmMessage'
            )}
          </Typography>
        </RetailerActionsDialog>

        <RetailerActionsDialog
          open={isRestoreDialogOpen}
          onClose={onRestoreDialogCancel}
          title={t(
            'backoffice.retailers.importer.restore.restoreDeletedRetailer'
          )}
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
                onClick={onRestoreRetailer}
                variant="contained"
                loading={deleteOrRestoreRetailerApiQuery.isLoading}
              >
                {t('backoffice.common.restore')}
              </LoadingButton>
            </>
          }
        >
          <Typography variant="body1" color="text.secondary">
            {t('backoffice.retailers.importer.restore.restoreRetailerMessage')}
          </Typography>
          <Stack marginTop={1} direction="row" alignItems="center">
            <Typography variant="body1" sx={{ mr: 3 }}>
              {t('backoffice.common.newStatus')}:
            </Typography>
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
      </>
    </Card>
  );
}
