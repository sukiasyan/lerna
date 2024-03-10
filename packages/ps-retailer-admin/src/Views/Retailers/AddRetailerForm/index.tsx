import {
  Alert,
  Autocomplete,
  Card,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { updateSocialMediaUrl } from '../socialMediaUtils';

import { CountryAutocomplete } from '~/components/CountryAutocomplete';
import { COUNTRY_CODES, LanguagesTypes } from '~/constants';
import {
  IUnityRetailerWithOrganization,
  IUnitySocialMediaTypes,
  IUnitySocialMediaURL,
  IUnityStatus
} from '~/types/Retailers';
import { IDuplicateDataProps } from '~/Views/Retailers/RetailerDrawer';

interface IAddRetailerFormProps<T extends object> {
  form: IUnityRetailerWithOrganization['retailer'];
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  remove: <K extends keyof T>(key: K) => void;
  duplicateData: IDuplicateDataProps | undefined;
}

const AddRetailerForm = ({
  form,
  set: setFormValue,
  remove,
  duplicateData
}: IAddRetailerFormProps<IUnityRetailerWithOrganization['retailer']>) => {
  // Aliases
  const { t } = useTranslation();

  const handleUpdateSocialMediaUrl = (
    platform: IUnitySocialMediaTypes,
    url: string
  ) => {
    updateSocialMediaUrl(
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

  useEffect(() => {
    setFormValue('status', form.status ?? IUnityStatus.ACTIVE);
  }, [form.status, setFormValue]);

  return (
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
          onChange={(event) =>
            event.target.value === ''
              ? remove('name')
              : setFormValue('name', event.target.value)
          }
          required
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
          onChange={(event) =>
            event.target.value === ''
              ? remove('domain')
              : setFormValue('domain', event.target.value)
          }
          required
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
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('backoffice.common.country')}
              required
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
          onChange={(_event, option) => {
            if (option.length === 0) {
              remove('languageCodes');
            } else {
              setFormValue('languageCodes', option);
            }
          }}
          value={form.languageCodes ?? []}
          size="small"
          renderInput={(params) => (
            <TextField {...params} label={t('backoffice.common.languages')} />
          )}
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

        {/*<FormGroup>*/}
        {/*  <Typography variant="overline">*/}
        {/*    {t('backoffice.retailers.importer.create.features')}*/}
        {/*  </Typography>*/}
        {/*  <FormControlLabel*/}
        {/*    control={*/}
        {/*      <Checkbox*/}
        {/*        onChange={(event) => {*/}
        {/*          const newRetailerAttributes = {*/}
        {/*            ...form.retailerAttributes,*/}
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
        {/*        onChange={(event) => {*/}
        {/*          const newRetailerAttributes = {*/}
        {/*            ...form.retailerAttributes,*/}
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
          onChange={(event) =>
            handleUpdateSocialMediaUrl('Facebook', event.target.value)
          }
        />

        <TextField
          fullWidth
          size="small"
          label="Instagram"
          variant="outlined"
          onChange={(event) =>
            handleUpdateSocialMediaUrl('Instagram', event.target.value)
          }
        />

        <TextField
          fullWidth
          size="small"
          label="Twitter"
          variant="outlined"
          onChange={(event) =>
            handleUpdateSocialMediaUrl('X', event.target.value)
          }
        />
      </Stack>
    </Card>
  );
};

export default AddRetailerForm;
