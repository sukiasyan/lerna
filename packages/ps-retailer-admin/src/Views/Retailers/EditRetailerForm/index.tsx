import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import RetailerActionsDialog from '../RetailerActionsDialog';
import { IDuplicateDataProps } from '../RetailerDrawer';
import { handleAlternatePSCodesChange } from '../Retailers.utils';

import { CountryAutocomplete } from '~/components/CountryAutocomplete';
import { COUNTRY_CODES, LanguagesTypes } from '~/constants';
import { useDeleteOrRestoreRetailerMutation } from '~/Store';

import {
  IUnityRetailerWithOrganization,
  IUnitySocialMediaTypes,
  IUnitySocialMediaURL,
  IUnityStatus
} from '~/types/Retailers';
import { updateSocialMediaUrlEditForm } from '~/Views/Retailers/socialMediaUtils';

interface IEditRetailerFormProps<T extends object> {
  form: IUnityRetailerWithOrganization['retailer'];
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  remove: <K extends keyof T>(key: K) => void;
  onClose: () => void;
  duplicateData: IDuplicateDataProps | undefined;
  retailer: IUnityRetailerWithOrganization['retailer'];
  setAreAlternatePSCodesValid: Dispatch<SetStateAction<boolean>>;
}

const EditRetailerForm = ({
  form,
  set: setFormValue,
  remove,
  onClose,
  duplicateData,
  retailer,
  setAreAlternatePSCodesValid
}: IEditRetailerFormProps<IUnityRetailerWithOrganization['retailer']>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteOrRestoreRetailerApi, deleteOrRestoreRetailerApiQuery] =
    useDeleteOrRestoreRetailerMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdateSocialMediaUrl = (
    platform: IUnitySocialMediaTypes,
    url: string
  ) => {
    updateSocialMediaUrlEditForm(
      form.socialMediaURLs as IUnitySocialMediaURL[],
      (urls) => setFormValue('socialMediaURLs', urls),
      platform,
      url
    );
  };

  const isDuplicate = useMemo(() => {
    return (
      duplicateData &&
      form.name === duplicateData?.duplicateName &&
      form.domain === duplicateData?.duplicateDomain &&
      form.countryCode === duplicateData?.duplicateCountry
    );
  }, [form.name, form.domain, form.countryCode, duplicateData]);

  const onDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const onCloseDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const onRetrailDelete = async () => {
    await deleteOrRestoreRetailerApi({
      body: { status: IUnityStatus.DELETED },
      PSRTID: retailer.PSRTID
    }).unwrap();
  };

  useEffect(() => {
    if (deleteOrRestoreRetailerApiQuery.isSuccess) {
      setIsDeleteDialogOpen(false);
      onClose();
      navigate('/retailers/search');
    }
  }, [deleteOrRestoreRetailerApiQuery.isSuccess, navigate, onClose]);

  useEffect(() => {
    setFormValue('name', retailer.name);
    setFormValue('logoURLs', retailer.logoURLs ?? null);
    setFormValue('domain', retailer.domain);
    setFormValue('countryCode', retailer.countryCode);
    setFormValue('status', retailer.status);
    setFormValue(
      'retailerAttributes' as keyof IUnityRetailerWithOrganization['retailer'],
      retailer.retailerAttributes
    );
    setFormValue(
      'alternatePSCodes' as keyof IUnityRetailerWithOrganization['retailer'],
      retailer.alternatePSCodes
    );
    setFormValue('socialMediaURLs', retailer.socialMediaURLs);
  }, [retailer, setFormValue]);

  // Update the state of isAlternatePSCode based on whether there's an item in form.alternatePSCodes with an empty sourceEntityID.
  useEffect(() => {
    const hasEmptySourceEntityID =
      form.alternatePSCodes?.some((item) => item.sourceEntityID === '') ??
      false;
    setAreAlternatePSCodesValid(!hasEmptySourceEntityID);
  }, [form?.alternatePSCodes, setAreAlternatePSCodesValid]);

  return (
    <>
      <Card sx={{ p: 2 }}>
        <Stack spacing={2}>
          {isDuplicate && (
            <Alert color="error">
              {t('backoffice.retailers.importer.errors.duplicateRetailer')}
            </Alert>
          )}
          <Typography variant="overline">
            {t('backoffice.common.basicDetails')}
          </Typography>

          <TextField
            fullWidth
            size="small"
            label={t('backoffice.retailers.importer.create.logoUrl')}
            variant="outlined"
            defaultValue={retailer?.logoURLs}
            onChange={(event) =>
              event.target.value === ''
                ? remove('logoURLs')
                : setFormValue('logoURLs', [event.target.value])
            }
          />

          <TextField
            fullWidth
            size="small"
            label={t('backoffice.common.name')}
            variant="outlined"
            defaultValue={retailer.name}
            onChange={(event) =>
              event.target.value === ''
                ? remove('name')
                : setFormValue('name', event.target.value)
            }
            error={!form.name || isDuplicate}
            helperText={
              !form.name
                ? t('backoffice.retailers.importer.errors.mandatoryName')
                : ''
            }
          />

          <TextField
            fullWidth
            size="small"
            label={t('backoffice.retailers.importer.create.domain')}
            variant="outlined"
            defaultValue={retailer.domain}
            onChange={(event) =>
              event.target.value === ''
                ? remove('domain')
                : setFormValue('domain', event.target.value)
            }
            error={!form.domain || isDuplicate}
            helperText={
              !form.domain
                ? t('backoffice.retailers.importer.errors.mandatoryDomain')
                : ''
            }
          />

          <Autocomplete
            disablePortal
            options={[]}
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('backoffice.common.organization')}
              />
            )}
          />

          <CountryAutocomplete
            size="small"
            options={COUNTRY_CODES}
            defaultValue={retailer.countryCode}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('backoffice.common.country')}
                error={!form.countryCode || isDuplicate}
                helperText={
                  !form.countryCode
                    ? t('backoffice.retailers.importer.errors.mandatoryDomain')
                    : ''
                }
              />
            )}
            onChange={(_, value) =>
              value === '' || value === null
                ? remove('countryCode')
                : setFormValue('countryCode', value)
            }
          />

          <Autocomplete
            multiple
            options={Object.keys(LanguagesTypes).sort()}
            getOptionLabel={(option) => LanguagesTypes[option]}
            defaultValue={retailer.languageCodes || []}
            renderInput={(params) => (
              <TextField {...params} label={t('backoffice.common.languages')} />
            )}
            size="small"
            onChange={(_event, option) => {
              if (option.length === 0) {
                remove('languageCodes');
              } else {
                setFormValue('languageCodes', option);
              }
            }}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  onChange={(event) =>
                    setFormValue(
                      'status',
                      event.target.checked
                        ? IUnityStatus.ACTIVE
                        : IUnityStatus.INACTIVE
                    )
                  }
                  checked={form.status === IUnityStatus.ACTIVE}
                />
              }
              label={t('backoffice.retailers.importer.create.setActive')}
            />
          </FormGroup>

          {Boolean(retailer?.alternatePSCodes?.length ?? 0) && (
            <Typography variant="overline">
              {t('backoffice.common.alternateCodes')}
            </Typography>
          )}
          {Boolean(retailer?.alternatePSCodes?.length ?? 0) &&
            retailer?.alternatePSCodes?.map(
              ({ sourceSystem, sourceEntityID }, index) => (
                <TextField
                  fullWidth
                  key={`${sourceSystem}-${index}`}
                  size="small"
                  label={sourceSystem}
                  variant="outlined"
                  defaultValue={sourceEntityID}
                  error={!form.alternatePSCodes?.[index]?.sourceEntityID}
                  helperText={
                    !form.alternatePSCodes?.[index]?.sourceEntityID &&
                    t(
                      'backoffice.retailers.importer.errors.emptySourceEntityID'
                    )
                  }
                  onChange={(event) => {
                    handleAlternatePSCodesChange(
                      form,
                      setFormValue,
                      sourceSystem,
                      event.target.value
                    );
                  }}
                />
              )
            )}

          {/*<FormGroup>*/}
          {/*  <Typography variant="overline">*/}
          {/*    {t('backoffice.retailers.importer.create.features')}*/}
          {/*  </Typography>*/}
          {/*  <FormControlLabel*/}
          {/*    control={*/}
          {/*      <Checkbox*/}
          {/*        defaultChecked={retailer.retailerAttributes?.bopis === 'true'}*/}
          {/*        onChange={(event) => {*/}
          {/*          const newRetailerAttributes = {*/}
          {/*            addToCart: form.retailerAttributes?.addToCart,*/}
          {/*            bopis: String(event.target.checked)*/}
          {/*          };*/}
          {/*          setFormValue('retailerAttributes', newRetailerAttributes);*/}
          {/*        }}*/}
          {/*      />*/}
          {/*    }*/}
          {/*    label="BOPIS"*/}
          {/*  />*/}
          {/*  <FormControlLabel*/}
          {/*    control={*/}
          {/*      <Checkbox*/}
          {/*        defaultChecked={*/}
          {/*          retailer.retailerAttributes?.addToCart === 'true'*/}
          {/*        }*/}
          {/*        onChange={(event) => {*/}
          {/*          const newRetailerAttributes = {*/}
          {/*            bopis: form.retailerAttributes?.bopis,*/}
          {/*            addToCart: String(event.target.checked)*/}
          {/*          };*/}
          {/*          setFormValue('retailerAttributes', newRetailerAttributes);*/}
          {/*        }}*/}
          {/*      />*/}
          {/*    }*/}
          {/*    label={t('backoffice.retailers.importer.create.addToCart')}*/}
          {/*  />*/}
          {/*</FormGroup>*/}

          <Typography variant="overline" color="text.secondary">
            {t('backoffice.retailers.importer.create.socialMedia')}
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Facebook"
            variant="outlined"
            defaultValue={
              retailer.socialMediaURLs?.find(
                (socialMedia) => socialMedia.platform === 'Facebook'
              )?.url
            }
            onChange={(event) =>
              handleUpdateSocialMediaUrl('Facebook', event.target.value)
            }
          />

          <TextField
            fullWidth
            size="small"
            label="Instagram"
            variant="outlined"
            defaultValue={
              retailer.socialMediaURLs?.find(
                (socialMedia) => socialMedia.platform === 'Instagram'
              )?.url
            }
            onChange={(event) =>
              handleUpdateSocialMediaUrl('Instagram', event.target.value)
            }
          />

          <TextField
            fullWidth
            size="small"
            label="Twitter"
            variant="outlined"
            defaultValue={
              retailer.socialMediaURLs?.find(
                (socialMedia) => socialMedia.platform === 'X'
              )?.url
            }
            onChange={(event) =>
              handleUpdateSocialMediaUrl('X', event.target.value)
            }
          />

          <Typography variant="overline" color="text.secondary">
            {t('backoffice.retailers.importer.delete.deleteRetailer')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('backoffice.retailers.importer.delete.deleteRetailerMessage')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <LoadingButton
              size="small"
              variant="outlined"
              color="error"
              onClick={onDelete}
            >
              {t('backoffice.retailers.importer.delete.deleteRetailer')}
            </LoadingButton>
          </Stack>
        </Stack>

        <RetailerActionsDialog
          open={isDeleteDialogOpen}
          onClose={onClose}
          title="Delete Retailer"
          actions={
            <>
              <Button color="secondary" onClick={onCloseDialog} variant="text">
                {t('backoffice.common.noCancel')}
              </Button>
              <LoadingButton
                color="error"
                autoFocus
                onClick={onRetrailDelete}
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
      </Card>
    </>
  );
};

export default EditRetailerForm;
