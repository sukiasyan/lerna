import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, IconButton, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffectOnce, useMap } from 'react-use';

import {
  DrawerContainerStyled,
  DrawerContentStyled
} from '../RetailerDrawer/RetailDrawer.styles';

import { DrawerWrapper } from '~/components';
import {
  useCreateLocalStoreMutation,
  useUpdateLoacalStoreMutation
} from '~/Store';

import { IUnityLocalStoreOverview } from '~/types/Retailers';
import LocalStoreEditForm from '~/Views/Retailers/LocalStores/LocalStoreEditForm.tsx';
import LocalStoreForm from '~/Views/Retailers/LocalStores/LocalStoreForm.tsx';
import { IDuplicateLocalStoreProps } from '~/Views/Retailers/RetailerDrawer';

interface IOnlineStoreDrawerProps {
  selectedRow?: IUnityLocalStoreOverview;
  open: boolean;
  mode?: string;
  onClose: () => void;
  onDeleteLocalStore?: () => Promise<void>;
  selectedRetailerName: string;
}

export default function LocalStoreDrawer(props: IOnlineStoreDrawerProps) {
  const {
    selectedRow,
    open,
    mode,
    onClose,
    onDeleteLocalStore,
    selectedRetailerName
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedRetailerID = queryParams.get('id');

  const [createLocalStoreApi, { isLoading: isCreating }] =
    useCreateLocalStoreMutation();
  const [updateLocalStoreApi, { isLoading: isUpdating }] =
    useUpdateLoacalStoreMutation();
  const [form, { set: setStoreFormValue, remove, reset: resetForm }] = useMap();

  const [isDataSourceValid, setIsDataSourceValid] = useState(true);
  const [areAlternatePSCodesValid, setAreAlternatePSCodesValid] =
    useState(true);
  const [duplicateData, setDuplicateData] = useState<
    IDuplicateLocalStoreProps | undefined
  >();

  useEffectOnce(() => {
    resetForm();
    setDuplicateData(undefined);
  });

  const onSubmit = useCallback(async () => {
    if (selectedRetailerID && mode !== 'edit') {
      try {
        await createLocalStoreApi({
          body: form,
          PSRTID: selectedRetailerID
        }).unwrap();

        onClose();

        setDuplicateData(undefined);

        navigate(
          `/retailerDetails?retailer=${selectedRetailerName}&id=${selectedRetailerID}`,
          {
            state: 'localStore'
          }
        );
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (error?.status === 409) {
          setDuplicateData({
            duplicateName: form.name,
            duplicateStreet: form.street,
            duplicateCity: form.city,
            duplicateState: form.state,
            duplicatePostcode: form.postcode
          });
        }
      }
    } else if (selectedRetailerID && mode === 'edit') {
      try {
        await updateLocalStoreApi({
          body: form,
          PSRTID: selectedRetailerID,
          PSRLSID: selectedRow?.PSRLSID ?? ''
        }).unwrap();
        onClose();

        setDuplicateData(undefined);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (error?.status === 409) {
          setDuplicateData({
            duplicateName: form.name,
            duplicateStreet: form.street,
            duplicateCity: form.city,
            duplicateState: form.state,
            duplicatePostcode: form.postcode
          });
        }
      }
    }
  }, [
    selectedRetailerID,
    mode,
    createLocalStoreApi,
    form,
    onClose,
    navigate,
    selectedRetailerName,
    updateLocalStoreApi,
    selectedRow?.PSRLSID
  ]);

  // Check if all required fields are filled
  const formValidation = useMemo(() => {
    return (
      form?.name?.length > 1 &&
      form?.name?.length < 100 &&
      form['address.street1'] &&
      form['address.city'] &&
      form['address.stateOrProvidence'] &&
      form['address.postalCode']
    );
    // Add DataSource only if it is changed
  }, [form]);

  return (
    <>
      <DrawerWrapper open={open}>
        <DrawerContainerStyled>
          <header>
            <Typography variant="h6">
              {mode !== 'edit'
                ? t('backoffice.retailers.importer.create.newLocalStore')
                : t('backoffice.retailers.importer.create.editLocalStore')}
            </Typography>
            <IconButton
              onClick={() => {
                onClose();
                resetForm();
                setDuplicateData(undefined);
              }}
            >
              <CloseIcon />
            </IconButton>
          </header>

          <DrawerContentStyled>
            {mode !== 'edit' ? (
              <LocalStoreForm
                form={form}
                remove={remove}
                setStoreFormValue={setStoreFormValue}
                selectedRetailerName={selectedRetailerName}
                setIsDataSourceValid={setIsDataSourceValid}
                duplicateData={duplicateData}
              />
            ) : (
              <LocalStoreEditForm
                form={form}
                selectedRow={selectedRow}
                remove={remove}
                setStoreFormValue={setStoreFormValue}
                selectedRetailerName={selectedRetailerName}
                setIsDataSourceValid={setIsDataSourceValid}
                setAreAlternatePSCodesValid={setAreAlternatePSCodesValid}
                onDeleteLocalStore={onDeleteLocalStore}
                onClose={onClose}
                duplicateData={duplicateData}
              />
            )}
          </DrawerContentStyled>
          <footer>
            <Button
              variant="text"
              color="inherit"
              fullWidth
              sx={{ mr: 2 }}
              onClick={() => {
                // resetForm();
                onClose();
                setDuplicateData(undefined);
              }}
            >
              {t('backoffice.common.cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              fullWidth
              loading={isCreating || isUpdating}
              onClick={onSubmit}
              disabled={
                !formValidation ||
                !isDataSourceValid ||
                !areAlternatePSCodesValid
              }
            >
              {t('backoffice.common.save')}
            </LoadingButton>
          </footer>
        </DrawerContainerStyled>
      </DrawerWrapper>
    </>
  );
}
