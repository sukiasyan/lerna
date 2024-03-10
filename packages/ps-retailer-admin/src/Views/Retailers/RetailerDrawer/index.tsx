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
import { useNavigate } from 'react-router-dom';
import { useEffectOnce, useMap } from 'react-use';

import AddRetailerForm from '../AddRetailerForm';
import EditRetailerForm from '../EditRetailerForm';

import {
  DrawerContainerStyled,
  DrawerContentStyled
} from './RetailDrawer.styles';

import { DrawerWrapper } from '~/components';
import { useCreateRetailerMutation, useUpdateRetailerMutation } from '~/Store';
import { IUnityRetailerWithOrganization } from '~/types/Retailers';

export interface IDuplicateDataProps {
  duplicateDomain: string;
  duplicateName: string;
  duplicateCountry: string;
}

export interface IDuplicateLocalStoreProps {
  duplicateName: string;
  duplicateStreet: string;
  duplicateCity: string;
  duplicateState: string;
  duplicatePostcode: string;
}

export interface IRetailDrawerProps {
  editMode?: boolean;
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  retailer?: IUnityRetailerWithOrganization['retailer'];
  organization?: IUnityRetailerWithOrganization['organization'];
  onSubmit?: () => void;
}

export const RetailerDrawer = ({
  editMode = false,
  open,
  onClose,
  retailer,
  onSubmit
}: IRetailDrawerProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, { set: setFormValue, remove, reset: resetForm }] = useMap();
  const [duplicateData, setDuplicateData] = useState<
    IDuplicateDataProps | undefined
  >();
  const [areAlternatePSCodesValid, setAreAlternatePSCodesValid] =
    useState(true);

  const [
    updateRetailerApi,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading }
  ] = useUpdateRetailerMutation();
  const [
    createRetailerApi,
    { isSuccess: isCreateSuccess, isLoading: isCreateLoading }
  ] = useCreateRetailerMutation();

  useEffectOnce(() => {
    resetForm();
  });

  // Check if all required fields are filled
  const basicDetailsValidation = useMemo(() => {
    return (
      form.name &&
      form.name.length > 1 &&
      form.name.length < 100 &&
      form.domain &&
      form.countryCode
    );
  }, [form.name, form.domain, form.countryCode]);

  const handleClose = useCallback(() => {
    onClose(false);
    setDuplicateData(undefined);
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    let result;

    if (editMode && retailer && retailer.PSRTID) {
      try {
        result = await updateRetailerApi({
          body: form,
          PSRTID: retailer.PSRTID
        }).unwrap();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (error?.status === 409) {
          setDuplicateData({
            duplicateDomain: form.domain,
            duplicateName: form.name,
            duplicateCountry: form.countryCode
          });
        }
      }
    }

    if (!editMode) {
      try {
        result = await createRetailerApi({ body: form }).unwrap();

        handleClose();
        navigate(
          `/retailerDetails?retailer=${result?.name}&id=${result?.PSRTID}`
        );
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (error?.status === 409) {
          setDuplicateData({
            duplicateDomain: form.domain,
            duplicateName: form.name,
            duplicateCountry: form.countryCode
          });
        }
      }
    }

    if (result && !duplicateData) {
      onSubmit && onSubmit();
    } else {
      setDuplicateData({
        duplicateDomain: form.domain,
        duplicateName: form.name,
        duplicateCountry: form.countryCode
      });
    }
  }, [
    editMode,
    retailer,
    duplicateData,
    updateRetailerApi,
    form,
    createRetailerApi,
    onSubmit,
    handleClose,
    navigate
  ]);

  useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess) {
      handleClose();
    }
  }, [handleClose, isCreateSuccess, isUpdateSuccess]);

  return (
    <>
      <DrawerWrapper open={open}>
        <DrawerContainerStyled>
          <header>
            <Typography variant="h6">
              {editMode
                ? t('backoffice.retailers.importer.edit.editRetailer')
                : t('backoffice.retailers.importer.create.newRetailer')}
            </Typography>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </header>

          <DrawerContentStyled>
            {editMode ? (
              <EditRetailerForm
                form={form}
                duplicateData={duplicateData}
                remove={remove}
                onClose={handleClose}
                set={setFormValue}
                retailer={
                  retailer as IUnityRetailerWithOrganization['retailer']
                }
                setAreAlternatePSCodesValid={setAreAlternatePSCodesValid}
              />
            ) : (
              <AddRetailerForm
                form={form}
                remove={remove}
                set={setFormValue}
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
              onClick={handleClose}
            >
              {t('backoffice.common.cancel')}
            </Button>
            <LoadingButton
              variant="contained"
              fullWidth
              loading={isCreateLoading || isUpdateLoading}
              onClick={handleSubmit}
              disabled={!basicDetailsValidation || !areAlternatePSCodesValid}
            >
              {t('backoffice.common.save')}
            </LoadingButton>
          </footer>
        </DrawerContainerStyled>
      </DrawerWrapper>
    </>
  );
};

export default RetailerDrawer;
