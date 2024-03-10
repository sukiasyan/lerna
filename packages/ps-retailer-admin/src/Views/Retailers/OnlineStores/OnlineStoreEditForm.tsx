import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
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
import { Loading } from '@pricespider-neuintel/mesh';
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';

import RetailerActionsDialog from '../RetailerActionsDialog';
import {
  handleAlternatePSCodesChange,
  handleAutocompleteStoreType,
  mapStringToStoreType,
  storeTypesCaseTypes,
  toCamelCase
} from '../Retailers.utils';

import { CurrencyAutocomplete } from '~/components/CurrencyAutocomplete/CurrencyAutocomplete.tsx';
import { AVAILABLE_CURRENCY_CODES } from '~/constants';
import {
  ICreateOnlineStoreProps,
  IUnityOnlineStoreOverview,
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
  primaryStore: IUnityOnlineStoreOverview;
  setStoreFormValue: <K extends keyof T>(key: K, value: T[K]) => void;
  remove: <K extends keyof T>(key: K) => void;
  selectedRetailerName: string;
  setIsDataSourceValid: Dispatch<SetStateAction<boolean>>;
  setIsCurrenciesValid: Dispatch<SetStateAction<boolean>>;
  onDeleteOnlineStore: () => void;
  setAreAlternatePSCodesValid: Dispatch<SetStateAction<boolean>>;
}

const OnlineStoreEditForm = ({
  form,
  primaryStore,
  setStoreFormValue,
  remove,
  selectedRetailerName,
  setIsDataSourceValid,
  setIsCurrenciesValid,
  onDeleteOnlineStore,
  setAreAlternatePSCodesValid
}: IOnlineStoreForm<ICreateOnlineStoreProps>) => {
  // Aliases
  const { t } = useTranslation();

  const localForm = { ...form };

  // //Local State
  const [dataSourcesData, setDataSourcesData] = useState<
    IDataSourceValueProps[]
  >([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[] | []>(
    primaryStore.currencies.length !== 0
      ? primaryStore.currencies.map((item) => item.code)
      : []
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

  const handleDeleteOnlineStore = () => {
    setIsDeleteButtonLoading(true);
    onDeleteOnlineStore();
    setIsDeleteButtonLoading(false);
  };

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

  useEffect(() => {
    const result = selectedCurrencies?.map((code) => ({
      code,
      default: code === defaultCurrency
    }));

    if (result !== null) {
      setStoreFormValue('currencies', result);
    }
    if (selectedCurrencies.length === 0) {
      setDefaultCurrency(null);
    }
  }, [defaultCurrency, selectedCurrencies, setStoreFormValue]);

  useEffect(() => {
    // Logic for updating form based on dataSourcesData

    setStoreFormValue('dataSources', transformDataSource(dataSourcesData));
  }, [dataSourcesData, setStoreFormValue]);

  useEffect(() => {
    setStoreFormValue('status', form.status ?? IUnityStatus.INACTIVE);
  }, [form.status, setStoreFormValue]);

  useEffect(() => {
    setStoreFormValue('name', primaryStore.name);
    setStoreFormValue('domain', primaryStore.domain);
    setStoreFormValue('status', primaryStore.status);
    setStoreFormValue('currencies', primaryStore.currencies);
    setStoreFormValue('alternatePSCodes', primaryStore.alternatePSCodes);
    setStoreFormValue('storeType', primaryStore?.storeType);
    setStoreFormValue('dataSources', primaryStore.dataSources ?? []);

    const transformedArray = primaryStore?.dataSources?.map((item) => ({
      'dataSources.sourceType': item?.sourceType,
      'dataSources.source': item?.source,
      'dataSources.method': item?.method,
      'dataSources.currencyCode': item?.currencyCode,
      'dataSources.languageCode': item?.languageCode
    }));

    if (transformedArray) {
      setDataSourcesData(transformedArray);
    }
  }, [setStoreFormValue, primaryStore]);

  // Update the state of isAlternatePSCode based on whether there's an item in form.alternatePSCodes with an empty sourceEntityID.
  useEffect(() => {
    const hasEmptySourceEntityID =
      form.alternatePSCodes?.some((item) => item.sourceEntityID === '') ??
      false;
    setAreAlternatePSCodesValid(!hasEmptySourceEntityID);
  }, [form?.alternatePSCodes, setAreAlternatePSCodesValid]);

  if (Object.keys(localForm).length === 0) return <Loading />;

  return (
    <>
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
            defaultValue={primaryStore.name}
            onChange={(event) =>
              handleTextFieldValue('name', event.target.value)
            }
            error={!form?.name}
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
            defaultValue={toCamelCase(
              primaryStore?.storeType?.replace('_', ' ')
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('backoffice.retailers.importer.create.storeType')}
              />
            )}
            sx={{ flex: 1 }}
            onChange={(_event, value: string | null) => {
              const mappedValue = value?.toUpperCase()
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
            value={localForm?.currencies?.map((item) => item.code)}
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
            options={selectedCurrencies ?? []}
            onChange={handleDefaultCurrencyChange}
            value={
              localForm?.currencies
                ?.filter((item) => item.default)
                ?.map((item) => item.code)[0] ?? null
            }
            renderInput={(params) => (
              <TextField
                label={t('backoffice.common.defaultCurrency')}
                name="currencies"
                error={
                  form?.currencies &&
                  form?.currencies?.length !== 0 &&
                  !localForm?.currencies
                    ?.filter((item) => item.default)
                    ?.map((item) => item.code)[0]
                }
                helperText={
                  form?.currencies &&
                  form?.currencies?.length !== 0 &&
                  !localForm?.currencies
                    ?.filter((item) => item.default)
                    ?.map((item) => item.code)[0]
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
            defaultValue={primaryStore.domain}
            onChange={(event) =>
              handleTextFieldValue('domain', event.target.value)
            }
            error={!form.domain}
            helperText={
              !form.domain
                ? t('backoffice.retailers.importer.errors.mandatoryDomain')
                : ''
            }
          />

          {Boolean(primaryStore?.alternatePSCodes?.length ?? 0) && (
            <Typography variant="overline">
              {t('backoffice.common.alternateCodes')}
            </Typography>
          )}
          {Boolean(primaryStore?.alternatePSCodes?.length ?? 0) &&
            primaryStore?.alternatePSCodes?.map(
              ({ sourceSystem, sourceEntityID }, index) => (
                <TextField
                  fullWidth
                  key={`${sourceSystem}-${index}`}
                  size="small"
                  label={sourceSystem}
                  variant="outlined"
                  error={!form.alternatePSCodes?.[index]?.sourceEntityID}
                  helperText={
                    !form.alternatePSCodes?.[index]?.sourceEntityID &&
                    t(
                      'backoffice.retailers.importer.errors.emptySourceEntityID'
                    )
                  }
                  defaultValue={sourceEntityID}
                  onChange={(event) =>
                    handleAlternatePSCodesChange(
                      form,
                      setStoreFormValue,
                      sourceSystem,
                      event.target.value
                    )
                  }
                />
              )
            )}
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
              <DataSources<
                ICreateOnlineStoreProps,
                keyof ICreateOnlineStoreProps
              >
                key={`${data['dataSources.sourceType']}${index}`}
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

          <Typography variant="overline" color="text.secondary">
            {t('backoffice.retailers.importer.delete.deleteStore')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('backoffice.retailers.importer.delete.delete1pStoreMessage')}
          </Typography>
          <Stack direction="row" spacing={2}>
            <LoadingButton
              size="small"
              variant="outlined"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {t('backoffice.retailers.importer.delete.deleteStore')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>

      <RetailerActionsDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t('backoffice.retailers.importer.delete.deleteStore')}
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
              onClick={handleDeleteOnlineStore}
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
    </>
  );
};

export default OnlineStoreEditForm;
