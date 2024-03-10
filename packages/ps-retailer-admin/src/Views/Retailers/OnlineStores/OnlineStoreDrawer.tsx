import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, IconButton, Typography } from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useEffectOnce, useMap } from 'react-use';

import {
  DrawerContainerStyled,
  DrawerContentStyled
} from '../RetailerDrawer/RetailDrawer.styles';

import { DrawerWrapper } from '~/components';
import {
  useCreateOnlineStoreMutation,
  useDeleteOrRestoreOnlineStoreMutation,
  useUpdateOnlineStoreMutation
} from '~/Store';

import { IUnityOnlineStoreOverview, IUnityStatus } from '~/types/Retailers';
import OnlineStoreEditForm from '~/Views/Retailers/OnlineStores/OnlineStoreEditForm.tsx';
import OnlineStoreForm from '~/Views/Retailers/OnlineStores/OnlineStoreForm.tsx';

interface IOnlineStoreDrawerProps {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  mode?: string;
  primaryStore?: IUnityOnlineStoreOverview;
  onSubmit?: () => void;
  selectedRetailerName: string;
}

export default function OnlineStoreDrawer(props: IOnlineStoreDrawerProps) {
  // Aliases
  const { open, onClose, mode, primaryStore, selectedRetailerName } = props;
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedRetailerID = queryParams.get('id');

  const [createOnlineStoreApi, createOnlineStoreApiQuery] =
    useCreateOnlineStoreMutation();
  const [updateOnlineStoreApi, updateOnlineStoreApiQuery] =
    useUpdateOnlineStoreMutation();
  const [deleteOnlineStoreApi, deleteOnlineStoreApiQuery] =
    useDeleteOrRestoreOnlineStoreMutation();

  // Local State
  const [form, { set: setStoreFormValue, remove, reset: resetForm }] = useMap();
  const [isDataSourceValid, setIsDataSourceValid] = useState(true);
  const [isCurrenciesValid, setIsCurrenciesValid] = useState(true);
  const [areAlternatePSCodesValid, setAreAlternatePSCodesValid] =
    useState(true);

  useEffectOnce(() => {
    resetForm();
  });

  const handleSubmit = useCallback(async () => {
    if (!form.status) {
      setStoreFormValue('status', IUnityStatus.INACTIVE);
    }

    if (selectedRetailerID && mode !== 'edit') {
      await createOnlineStoreApi({
        body: form,
        PSRTID: selectedRetailerID
      }).unwrap();
    }

    if (selectedRetailerID && mode === 'edit') {
      await updateOnlineStoreApi({
        body: form,
        PSRTID: selectedRetailerID,
        PSROSID: primaryStore?.PSROSID ?? ''
      }).unwrap();
    }
  }, [
    form,
    selectedRetailerID,
    mode,
    setStoreFormValue,
    createOnlineStoreApi,
    updateOnlineStoreApi,
    primaryStore?.PSROSID
  ]);

  const onDeleteOnlineStore = async () => {
    await deleteOnlineStoreApi({
      status: IUnityStatus.DELETED,
      PSRTID: selectedRetailerID ?? '',
      PSROSID: primaryStore?.PSROSID ?? ''
    });
  };

  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  // Check if all required fields are filled
  const formValidation = useMemo(() => {
    return (
      form?.name?.length > 1 && form?.name?.length < 100 && form.domain

      // Add DataSource only if it is changed
    );
  }, [form?.name?.length, form.domain]);

  useEffect(() => {
    if (
      updateOnlineStoreApiQuery.isSuccess ||
      createOnlineStoreApiQuery.isSuccess
    ) {
      handleClose();
    }
  }, [
    handleClose,
    updateOnlineStoreApiQuery.isSuccess,
    createOnlineStoreApiQuery.isSuccess
  ]);

  useEffect(() => {
    if (deleteOnlineStoreApiQuery.isSuccess) {
      handleClose();
    }
  }, [
    createOnlineStoreApiQuery.isSuccess,
    deleteOnlineStoreApiQuery.isSuccess,

    handleClose,
    updateOnlineStoreApiQuery.isSuccess
  ]);

  return (
    <DrawerWrapper open={open}>
      <DrawerContainerStyled>
        <header>
          {mode === 'edit' ? (
            <Typography variant="h6">
              {t('backoffice.retailers.importer.create.updateOnlineStore')}
            </Typography>
          ) : (
            <Typography variant="h6">
              {t('backoffice.retailers.importer.create.newOnlineStore')}
            </Typography>
          )}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </header>
        <DrawerContentStyled>
          {mode !== 'edit' && (
            <OnlineStoreForm
              form={form}
              remove={remove}
              setStoreFormValue={setStoreFormValue}
              selectedRetailerName={selectedRetailerName}
              setIsDataSourceValid={setIsDataSourceValid}
              setIsCurrenciesValid={setIsCurrenciesValid}
            />
          )}
          {mode === 'edit' && primaryStore && (
            <OnlineStoreEditForm
              primaryStore={primaryStore}
              form={form}
              remove={remove}
              setStoreFormValue={setStoreFormValue}
              selectedRetailerName={selectedRetailerName}
              setIsDataSourceValid={setIsDataSourceValid}
              setIsCurrenciesValid={setIsCurrenciesValid}
              onDeleteOnlineStore={onDeleteOnlineStore}
              setAreAlternatePSCodesValid={setAreAlternatePSCodesValid}
            />
          )}
        </DrawerContentStyled>
        <footer>
          <Button
            variant="text"
            color="inherit"
            fullWidth
            sx={{ mr: 2 }}
            onClick={handleClose}
          >
            {t('backoffice.common.cancel')}
          </Button>
          <LoadingButton
            variant="contained"
            fullWidth
            loading={
              updateOnlineStoreApiQuery.isLoading ||
              createOnlineStoreApiQuery.isLoading
            }
            onClick={handleSubmit}
            disabled={
              !formValidation ||
              !isDataSourceValid ||
              !isCurrenciesValid ||
              !areAlternatePSCodesValid
            }
          >
            {t('backoffice.common.save')}
          </LoadingButton>
        </footer>
      </DrawerContainerStyled>
    </DrawerWrapper>
  );
}
