import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Button,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  handleAutocompleteStoreType,
  mapStringToStoreType,
  storeTypesCaseTypes
} from '../Retailers.utils';

import { CurrencyAutocomplete } from '~/components/CurrencyAutocomplete/CurrencyAutocomplete.tsx';
import { AVAILABLE_CURRENCY_CODES } from '~/constants';
import {
  ICreateOnlineStoreProps,
  IUnityStatus,
  StoreType
} from '~/types/Retailers';
import { transformDataSource } from '~/utils/transformDataSource.ts';
import DataSources, {
  IDataSourceValueProps
} from '~/Views/Retailers/DataSources.tsx';
import DrawerTitleCard from '~/Views/Retailers/DrawerTitleCard.tsx';

export interface IOnlineStoreForm<T extends object> {
  form: ICreateOnlineStoreProps;
  setStoreFormValue: <K extends keyof T>(key: K, value: T[K]) => void;
  remove: <K extends keyof T>(key: K) => void;
  selectedRetailerName: string | null;
  setIsDataSourceValid: Dispatch<SetStateAction<boolean>>;
  setIsCurrenciesValid: Dispatch<SetStateAction<boolean>>;
}

const OnlineStoreForm = ({
  form,
  setStoreFormValue,
  remove,
  selectedRetailerName,
  setIsDataSourceValid,
  setIsCurrenciesValid
}: IOnlineStoreForm<ICreateOnlineStoreProps>) => {
  // Aliases
  const { t } = useTranslation();

  const localForm = { ...form };

  // //Local State
  const [dataSourcesData, setDataSourcesData] = useState<
    IDataSourceValueProps[]
  >([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[] | []>(
    []
  );
  const [defaultCurrency, setDefaultCurrency] = useState<string | null>(null);
  const [isDefaultCurrencySelected, setIsDefaultCurrencySelected] =
    useState<boolean>(
      Boolean(
        localForm?.currencies
          ?.filter((item) => item.default)
          ?.map((item) => item.code)[0]
      )
    );

  const handleCurrencyChange = useCallback(
    (
      _event: SyntheticEvent<Element, Event>,
      value: SetStateAction<string[] | []>
    ) => {
      setSelectedCurrencies(value);
      // Disable the default currency selector if no currencies are selected
      if (value.length === 0) {
        setDefaultCurrency(null);
        setIsCurrenciesValid(false);
      }
    },
    [setIsCurrenciesValid]
  );

  const handleDefaultCurrencyChange = useCallback(
    (
      _event: SyntheticEvent<Element, Event>,
      value: SetStateAction<string | null>
    ) => {
      if (value !== null) {
        setDefaultCurrency(value);
        setIsCurrenciesValid(true);
      }
    },
    [setIsCurrenciesValid]
  );

  const handleDataSource = useCallback(
    (index: number, newData: IDataSourceValueProps) => {
      setDataSourcesData((prevData) => {
        const newDataArray = [...prevData];
        newDataArray[index] = newData;
        return newDataArray;
      });
    },
    []
  );

  const handleAddDataSource = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setDataSourcesData((prevData) => [
      ...prevData,
      { 'dataSources.sourceType': '' }
    ]);
  };

  const handleRemoveDataSource = useCallback((index: number) => {
    setDataSourcesData((prevData) => {
      const newDataArray = [...prevData];
      newDataArray.splice(index, 1);
      return newDataArray;
    });
  }, []);

  const handleTextFieldValue = (
    key: keyof ICreateOnlineStoreProps,
    value: string
  ) => {
    value === '' ? remove(key) : setStoreFormValue(key, value);
  };

  // Create the final object
  const currencies = useMemo(() => {
    return selectedCurrencies.map((code) => ({
      code,
      default: code === defaultCurrency
    }));
  }, [defaultCurrency, selectedCurrencies]);

  useEffect(() => {
    // Logic for updating form based on dataSourcesData

    setStoreFormValue('dataSources', transformDataSource(dataSourcesData));
  }, [dataSourcesData, setStoreFormValue]);

  useEffect(() => {
    setStoreFormValue('status', form.status ?? IUnityStatus.ACTIVE);
  }, [form.status, setStoreFormValue]);

  useEffect(() => {
    if (currencies.length !== 0) {
      setStoreFormValue('currencies', currencies);
    } else {
      remove('currencies');
    }
  }, [currencies, remove, setStoreFormValue]);

  useEffect(() => {
    const hasDefaultCurrency = Boolean(
      localForm?.currencies
        ?.filter((item) => item.default)
        ?.map((item) => item.code)[0]
    );
    setIsDefaultCurrencySelected(hasDefaultCurrency);

    if (localForm?.currencies?.length === 0) {
      setIsCurrenciesValid(true);
    }

    if (localForm?.currencies?.length !== 0 && !isDefaultCurrencySelected) {
      setIsCurrenciesValid(false);
    } else {
      setIsCurrenciesValid(true);
    }
  }, [
    defaultCurrency,
    isDefaultCurrencySelected,
    localForm?.currencies,
    localForm?.currencies?.length,
    setIsCurrenciesValid
  ]);

  return (
    <Stack spacing={2} p={3}>
      <DrawerTitleCard selectedRetailerName={selectedRetailerName} />
      <Stack spacing={2}>
        <Typography variant="overline" color="text.secondary">
          {t('backoffice.common.basicInfo')}
        </Typography>
        <TextField
          size="small"
          label={t('backoffice.retailers.importer.create.storeName')}
          variant="outlined"
          sx={{ flex: 1 }}
          onChange={(event) => handleTextFieldValue('name', event.target.value)}
          required
          helperText={
            !form?.name
              ? t('backoffice.retailers.importer.errors.mandatoryName')
              : ''
          }
        />
        <Autocomplete
          disablePortal
          options={storeTypesCaseTypes(
            Object.values(StoreType).map((store) => store.replace('_', ' '))
          )}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('backoffice.retailers.importer.create.storeType')}
            />
          )}
          sx={{ flex: 1 }}
          onChange={(_event, value: string | null) => {
            const mappedValue = value
              ? mapStringToStoreType(value.toUpperCase())
              : null;
            handleAutocompleteStoreType<
              ICreateOnlineStoreProps,
              keyof ICreateOnlineStoreProps
            >('storeType', mappedValue, setStoreFormValue, remove);
          }}
        />

        <CurrencyAutocomplete
          multiple
          size="small"
          options={AVAILABLE_CURRENCY_CODES}
          onChange={handleCurrencyChange}
          value={selectedCurrencies}
          renderInput={(params) => (
            <TextField
              label={t('backoffice.common.currencies')}
              name="currencies"
              {...params}
            />
          )}
        />

        <CurrencyAutocomplete
          size="small"
          options={selectedCurrencies}
          onChange={handleDefaultCurrencyChange}
          value={defaultCurrency}
          disabled={selectedCurrencies.length === 0}
          renderInput={(params) => (
            <TextField
              label={t('backoffice.common.defaultCurrency')}
              name="currencies"
              required={
                form?.currencies?.length !== 0 &&
                !localForm?.currencies
                  ?.filter((item) => item.default)
                  ?.map((item) => item.code)[0]
              }
              helperText={
                !defaultCurrency
                  ? t(
                      'backoffice.retailers.importer.errors.mandatoryDefaultCurrency'
                    )
                  : ''
              }
              {...params}
            />
          )}
        />

        <TextField
          size="small"
          label={t('backoffice.retailers.importer.create.domain')}
          variant="outlined"
          sx={{ flex: 1 }}
          onChange={(event) =>
            handleTextFieldValue('domain', event.target.value)
          }
          required
          helperText={
            !form.domain
              ? t('backoffice.retailers.importer.errors.mandatoryDomain')
              : ''
          }
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                onChange={(event) =>
                  setStoreFormValue(
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
        <Typography variant="overline" color="text.secondary">
          {t('backoffice.retailers.importer.create.dataSources')}
        </Typography>
        {Array.isArray(localForm?.dataSources) &&
          dataSourcesData.map((data, index) => (
            <DataSources<ICreateOnlineStoreProps, keyof ICreateOnlineStoreProps>
              key={`${data}${index}`}
              onRemove={handleRemoveDataSource}
              form={localForm?.dataSources[index]}
              remove={remove}
              index={index}
              data={data}
              onDataChange={(newData) => handleDataSource(index, newData)}
              setIsDataSourceValid={setIsDataSourceValid}
            />
          ))}
        <Button
          startIcon={<AddIcon />}
          size="small"
          sx={{ width: 'auto', alignSelf: 'flex-start' }}
          onClick={handleAddDataSource}
        >
          {t('backoffice.retailers.importer.create.addDataSource')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default OnlineStoreForm;
