import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import RestoreIcon from '@mui/icons-material/Restore';
import { LoadingButton } from '@mui/lab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Loading } from '@pricespider-neuintel/mesh';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import RetailerActionsDialog from '../RetailerActionsDialog';
import RetailerDrawer from '../RetailerDrawer';
import StatusIndicator from '../StatusIndicator';

import {
  useDeleteOrRestoreOnlineStoreMutation,
  useDeleteOrRestoreRetailerMutation,
  useGetOnlineStoreQuery,
  useGetRetailerOverviewQuery
} from '~/Store';

import { IUnityStatus } from '~/types/Retailers';
import LocalStore from '~/Views/Retailers/LocalStores/LocalStore.tsx';
import LocalStoreDrawer from '~/Views/Retailers/LocalStores/LocalStoreDrawer.tsx';
import OnlineStore from '~/Views/Retailers/OnlineStores/OnlineStore.tsx';
import OnlineStoreDrawer from '~/Views/Retailers/OnlineStores/OnlineStoreDrawer.tsx';
import RetailerOverviewCards from '~/Views/Retailers/RetailerDetails/RetailerOverviewCards.tsx';
import {
  BasicDetailsStyled,
  HeaderActionsStyled,
  ModuleBodyStyled,
  ModuleHeaderStyled,
  RetailersComponentStyled
} from '~/Views/Retailers/RetailersStyles.tsx';

const RetailerDetails = () => {
  // Aliases
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const selectedID = queryParams.get('id');

  const { state: activeTabState } = useLocation();
  const { data: getOnlineStoreApi } = useGetOnlineStoreQuery(selectedID ?? '');
  const { data: getRetailerOverviewApi } = useGetRetailerOverviewQuery({
    PSRTID: selectedID ?? ''
  });
  const [deleteOrRestoreRetailerApi, deleteOrRestoreRetailerApiQuery] =
    useDeleteOrRestoreRetailerMutation();
  const [deleteOnlineStoreApi, deleteOnlineStoreApiQuery] =
    useDeleteOrRestoreOnlineStoreMutation();

  //Local State
  const [tabValue, setTabValue] = useState('1');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [openOnlineStoreDrawer, setOpenOnlineStoreDrawer] = useState(false);
  const [openLocalStoreDrawer, setOpenLocalStoreDrawer] = useState(false);

  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isRestoreOnlineStoreDialogOpen, setIsRestoreOnlineDialogOpen] =
    useState(false);
  const [statusValue, setStatusValue] = useState<IUnityStatus | null>(null);
  const [localStoreStatusValue, setLocalStoreStatusValue] =
    useState<IUnityStatus | null>(null);

  const [, setShouldReloadRetailerDetails] = useState(false);

  const [mode, setMode] = useState('');

  const open = Boolean(anchorEl);

  const primaryStore = useMemo(() => {
    return getOnlineStoreApi?.filter((item) => item.siteID === null)[0];
  }, [getOnlineStoreApi]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const isStatusActiveOrInactive = (status: IUnityStatus) => {
    return status === IUnityStatus.DELETED;
  };

  const onEditOnlineStore = () => {
    setOpenOnlineStoreDrawer(true);
    setMode('edit');
  };

  const onRestoreDialogOpen = () => {
    setIsRestoreDialogOpen(true);
  };

  const onRestoreOnlineStoreDialogOpen = () => {
    setIsRestoreOnlineDialogOpen(true);
  };

  const onRestoreDialogCancel = () => {
    setIsRestoreDialogOpen(false);
    setStatusValue(null);
  };

  const onRestoreOnlineStoreDialogCancel = () => {
    setIsRestoreOnlineDialogOpen(false);
    setStatusValue(null);
  };

  const onRestoreRetailer = async () => {
    await deleteOrRestoreRetailerApi({
      body: { status: statusValue ?? IUnityStatus.INACTIVE },
      PSRTID: String(selectedID)
    }).unwrap();
  };

  const onRestoreOnlineStore = async () => {
    await deleteOnlineStoreApi({
      status: localStoreStatusValue ?? IUnityStatus.INACTIVE,
      PSRTID: selectedID ?? '',
      PSROSID: primaryStore?.PSROSID ?? ''
    });
  };

  useEffect(() => {
    if (deleteOrRestoreRetailerApiQuery.isSuccess) {
      setIsRestoreDialogOpen(false);
    }
  }, [deleteOrRestoreRetailerApiQuery.isSuccess, navigate]);

  useEffect(() => {
    switch (activeTabState) {
      case 'onlineStore':
        setTabValue('2');
        break;
      case 'localStore':
        setTabValue('3');
        break;
      default:
        setTabValue('1');
    }
  }, [activeTabState, setTabValue]);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem('openRetailerEditDrawer');

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData === true) {
        setIsEditDrawerOpen(true);
        localStorage.removeItem('openRetailerEditDrawer');
      }
    }
  }, []);

  useEffect(() => {
    if (deleteOnlineStoreApiQuery.isSuccess && getRetailerOverviewApi) {
      setIsRestoreOnlineDialogOpen(false);
      navigate(
        `/retailerDetails?retailer=${getRetailerOverviewApi?.retailer?.name}&id=${selectedID}`,
        { state: 'onlineStore' }
      );
    }
  }, [
    deleteOnlineStoreApiQuery.isSuccess,

    navigate,
    getRetailerOverviewApi?.retailer?.name,
    selectedID,
    getRetailerOverviewApi
  ]);

  if (!getRetailerOverviewApi?.retailer) {
    return (
      <RetailersComponentStyled>
        <Loading />
      </RetailersComponentStyled>
    );
  }

  return (
    <>
      <RetailersComponentStyled>
        <ModuleHeaderStyled>
          <Box display="flex" alignItems="center">
            <Link to="/retailers/search">
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h5" color="text.primary">
              {t('backoffice.retailers.importer.retailerTable.header')}
            </Typography>
          </Box>

          <HeaderActionsStyled>
            <Box display="flex" alignItems="center" gap={2}>
              {!isStatusActiveOrInactive(
                getRetailerOverviewApi.retailer.status
              ) ? (
                <Button
                  variant="text"
                  color="secondary"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => setIsEditDrawerOpen(true)}
                >
                  {t('backoffice.retailers.importer.edit.editRetailer')}
                </Button>
              ) : (
                <Button
                  variant="text"
                  color="secondary"
                  startIcon={<RestoreIcon />}
                  onClick={onRestoreDialogOpen}
                >
                  {t('backoffice.retailers.importer.restore.restoreRetailer')}
                </Button>
              )}

              {!isStatusActiveOrInactive(
                getRetailerOverviewApi.retailer.status
              ) && (
                <Button
                  variant="outlined"
                  onClick={handleClick}
                  startIcon={<EditOutlinedIcon />}
                  endIcon={<ArrowDropDownIcon />}
                >
                  {t('backoffice.retailers.importer.create.addStore')}
                </Button>
              )}

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {!primaryStore && (
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);

                      setOpenOnlineStoreDrawer(true);
                    }}
                  >
                    {t('backoffice.retailers.importer.create.onlineStore')}
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);

                    setOpenLocalStoreDrawer(true);
                  }}
                >
                  {t('backoffice.retailers.importer.create.localStore')}
                </MenuItem>
              </Menu>
            </Box>
          </HeaderActionsStyled>
        </ModuleHeaderStyled>

        <ModuleBodyStyled>
          <BasicDetailsStyled>
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              spacing={2}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {getRetailerOverviewApi.retailer?.name ?? ''}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography>
                    {t('backoffice.retailers.importer.create.domain')}
                  </Typography>
                  <Typography>{t('backoffice.common.status')}</Typography>
                </Grid>
                <Grid item xs={11}>
                  <Typography>
                    {getRetailerOverviewApi?.retailer?.domain ?? ''}
                  </Typography>
                  <StatusIndicator
                    value={getRetailerOverviewApi?.retailer?.status}
                    small
                  />
                </Grid>
              </Grid>
            </Stack>
          </BasicDetailsStyled>

          <Box width="100%">
            <TabContext value={tabValue}>
              <Box borderBottom={1} borderColor="divider">
                <TabList onChange={handleChange}>
                  <Tab label={t('backoffice.common.overview')} value="1" />
                  <Tab
                    label={t(
                      'backoffice.retailers.importer.create.onlineStore'
                    )}
                    value="2"
                  />
                  <Tab
                    label={t('backoffice.retailers.importer.create.localStore')}
                    value="3"
                  />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ px: 0 }}>
                <RetailerOverviewCards />
              </TabPanel>
              <TabPanel value="2" sx={{ px: 0 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                  sx={{ pt: 2, pb: 1, pl: 3 }}
                >
                  {primaryStore && (
                    <Typography variant="overline">
                      {t('backoffice.retailers.importer.create.storeInfo')}
                    </Typography>
                  )}
                  <IconButton
                    onClick={
                      primaryStore &&
                      primaryStore?.status !== IUnityStatus.DELETED
                        ? onEditOnlineStore
                        : onRestoreOnlineStoreDialogOpen
                    }
                  >
                    {primaryStore &&
                      primaryStore?.status !== undefined &&
                      (primaryStore?.status === IUnityStatus.DELETED ? (
                        <RestartAltIcon />
                      ) : (
                        <EditOutlinedIcon color="action" />
                      ))}
                  </IconButton>
                </Stack>
                <OnlineStore
                  retailerId={selectedID}
                  setOpenOnlineStoreDrawer={setOpenOnlineStoreDrawer}
                />
              </TabPanel>
              <TabPanel value="3" sx={{ px: 0 }}>
                <LocalStore
                  retailerId={selectedID}
                  setOpenLocalStoreDrawer={setOpenLocalStoreDrawer}
                  selectedRetailerName={getRetailerOverviewApi.retailer.name}
                />
              </TabPanel>
            </TabContext>
          </Box>

          {/*{isEditDrawerOpen && (*/}
          <RetailerDrawer
            open={isEditDrawerOpen}
            onClose={setIsEditDrawerOpen}
            // onClose={() => setIsEditDrawerOpen(false)}
            editMode={true}
            retailer={getRetailerOverviewApi.retailer}
            organization={getRetailerOverviewApi.organization}
          />
          {/*)}*/}

          <OnlineStoreDrawer
            mode={mode}
            primaryStore={primaryStore}
            selectedRetailerName={getRetailerOverviewApi.retailer.name}
            open={openOnlineStoreDrawer}
            onClose={setOpenOnlineStoreDrawer}
            onSubmit={() => setShouldReloadRetailerDetails(true)}
          />

          <LocalStoreDrawer
            open={openLocalStoreDrawer}
            onClose={() => setOpenLocalStoreDrawer(false)}
            selectedRetailerName={getRetailerOverviewApi.retailer.name}
          />
        </ModuleBodyStyled>

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
      </RetailersComponentStyled>

      <RetailerActionsDialog
        open={isRestoreOnlineStoreDialogOpen}
        onClose={onRestoreOnlineStoreDialogCancel}
        title={t(
          'backoffice.retailers.importer.restore.restoreDeletedRetailer'
        )}
        actions={
          <>
            <Button
              color="secondary"
              onClick={onRestoreOnlineStoreDialogCancel}
              variant="text"
            >
              {t('backoffice.common.cancel')}
            </Button>
            <LoadingButton
              disabled={
                localStoreStatusValue !== IUnityStatus.ACTIVE &&
                localStoreStatusValue !== IUnityStatus.INACTIVE
              }
              autoFocus
              onClick={onRestoreOnlineStore}
              variant="contained"
              loading={deleteOnlineStoreApiQuery.isLoading}
            >
              {t('backoffice.common.restore')}
            </LoadingButton>
          </>
        }
      >
        <Typography variant="body1" color="text.secondary">
          {t('backoffice.retailers.importer.restore.restoreRetailerMessage')}
        </Typography>
        <Stack marginTop={1}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={(event) => {
                    setLocalStoreStatusValue(
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
  );
};

export default RetailerDetails;
