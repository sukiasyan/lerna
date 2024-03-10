import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Autocomplete, Button, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CurrencyAutocomplete } from '~/components/CurrencyAutocomplete/CurrencyAutocomplete.tsx';
import { AVAILABLE_CURRENCY_CODES, LanguagesTypes } from '~/constants';
import { IUnityDataSources, StoreType } from '~/types/Retailers';

export interface IDataSourceValueProps {
  'dataSources.sourceType': string;
  // Add more fields as needed
}

interface IDataSourcesProps<T extends object, K extends keyof T> {
  onRemove: (index: number) => void;
  form: IUnityDataSources;
  remove: (key: K) => void;
  index: number;
  data: IDataSourceValueProps;
  onDataChange: (newData: IDataSourceValueProps) => void;
  setIsDataSourceValid: Dispatch<SetStateAction<boolean>>;
}

const DataSources = <T extends object, K extends keyof T>({
  onRemove,
  form,
  remove,
  index,
  data,
  onDataChange,
  setIsDataSourceValid
}: IDataSourcesProps<T, K>) => {
  // Aliases
  const { t } = useTranslation();

  const handleTextFieldValueArray = (
    field: keyof IUnityDataSources,
    value: string
  ) => {
    // Update the local state and inform the parent about the change
    onDataChange({ ...data, [field]: value });
  };

  const handleAutocompleteValue = (
    key: keyof IUnityDataSources,
    value: StoreType | string | null
  ) => {
    if (value === null) {
      remove(key as K);
    }

    if (typeof value === 'string') {
      // Check if the value is a language name
      const isLanguageName = Object.values(LanguagesTypes).includes(value);

      if (isLanguageName) {
        // Get the corresponding language code
        const languageCode = Object.keys(LanguagesTypes).find(
          (code) => LanguagesTypes[code] === value
        );

        // Use the language code when setting the form value
        if (languageCode) {
          onDataChange({ ...data, [key as K]: languageCode as T[K] });
        }
      } else {
        // Use the current logic for other Autocomplete values
        onDataChange({ ...data, [key as K]: value as T[K] });
      }
    }
  };

  const isDataSourceValid = () => {
    if (form?.sourceType === 'Crawling' && form?.currencyCode) {
      return true;
    }

    return !!(
      form?.sourceType === 'Feed' &&
      form?.source &&
      form?.currencyCode
    );
  };

  useEffect(() => {
    setIsDataSourceValid(isDataSourceValid());
  }, [isDataSourceValid, setIsDataSourceValid]);

  return (
    <>
      <Autocomplete
        disablePortal
        options={['Crawling', 'Feed']}
        size="small"
        value={form?.sourceType || ''}
        onChange={(_event, value) =>
          handleAutocompleteValue(
            'dataSources.sourceType' as keyof IUnityDataSources,
            value
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={t('backoffice.retailers.importer.create.sourceType')}
            required={!form?.sourceType}
            helperText={
              !form?.sourceType
                ? t('backoffice.retailers.importer.errors.mandatorySourceType')
                : ''
            }
          />
        )}
      />
      <TextField
        size="small"
        label="Source"
        variant="outlined"
        required={data['dataSources.sourceType'] === 'Feed'}
        // defaultValue={form?.source || ''}
        onChange={(event) =>
          handleTextFieldValueArray(
            'dataSources.source' as keyof IUnityDataSources,
            event.target.value
          )
        }
        error={form?.sourceType === 'Feed' && !form?.source}
        helperText={
          form?.sourceType === 'Feed' && !form?.source
            ? t('backoffice.retailers.importer.errors.mandatorySource')
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
            label={t('backoffice.retailers.importer.create.method')}
          />
        )}
      />
      <CurrencyAutocomplete
        size="small"
        options={AVAILABLE_CURRENCY_CODES}
        onChange={(_event, value) =>
          handleAutocompleteValue(
            'dataSources.currencyCode' as keyof IUnityDataSources,
            value
          )
        }
        value={form?.currencyCode || ''}
        renderInput={(params) => (
          <TextField
            label={t('backoffice.common.currencies')}
            name="currencies"
            required={!form?.currencyCode}
            helperText={
              !form?.currencyCode
                ? t('backoffice.retailers.importer.errors.mandatoryCurrency')
                : ''
            }
            {...params}
          />
        )}
      />

      <Autocomplete
        options={Object.keys(LanguagesTypes).sort()}
        getOptionLabel={(option) => LanguagesTypes[option] || ''}
        onChange={(_event, option) => {
          handleAutocompleteValue(
            'dataSources.languageCode' as keyof IUnityDataSources,
            option
          );
        }}
        value={form?.languageCode || ''}
        size="small"
        renderInput={(params) => (
          <TextField {...params} label={t('backoffice.common.languages')} />
        )}
      />

      <Button
        startIcon={<DeleteOutlineIcon sx={{ fontSize: 24 }} />}
        variant="text"
        color="error"
        onClick={() => onRemove(index)}
      >
        {t('backoffice.common.delete')}
      </Button>
    </>
  );
};

export default DataSources;
