import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import RetailerActionsDialog from '../RetailerActionsDialog';
import {
  handleAlternatePSCodesChange,
  handleAutocompleteStoreType,
  mapStringToStoreType,
  storeTypesCaseTypes,
  toCamelCase
} from '../Retailers.utils';

import {
  IUnityCreateLocalStore,
  IUnityGeoCodes,
  IUnityLocalStoreOverview,
  IUnitySocialMediaTypes,
  StoreType
} from '~/types/Retailers';
import { transformDataSource } from '~/utils/transformDataSource.ts';
import DataSources, {
  IDataSourceValueProps
} from '~/Views/Retailers/DataSources.tsx';
import DrawerTitleCard from '~/Views/Retailers/DrawerTitleCard.tsx';
import { generateScheduleString } from '~/Views/Retailers/LocalStores/generateScheduleString.ts';
import OpenHours, {
  Schedule,
  ScheduleState
} from '~/Views/Retailers/LocalStores/OpenHours.tsx';
import parseScheduleString from '~/Views/Retailers/LocalStores/parseScheduleString.ts';
import { IDuplicateLocalStoreProps } from '~/Views/Retailers/RetailerDrawer';
import { updateSocialMediaUrlEditForm } from '~/Views/Retailers/socialMediaUtils';

export interface ILocalStoreEditForm<T extends object> {
  form: IUnityCreateLocalStore;
  selectedRow?: IUnityLocalStoreOverview | undefined;
  setStoreFormValue: <K extends keyof T>(key: K, value: T[K]) => void;
  remove: <K extends keyof T>(key: K) => void;
  selectedRetailerName: string;
  setIsDataSourceValid: Dispatch<SetStateAction<boolean>>;
  setAreAlternatePSCodesValid: Dispatch<SetStateAction<boolean>>;
  onDeleteLocalStore?: () => Promise<void>;
  onClose?: () => void;
  duplicateData: IDuplicateLocalStoreProps | undefined;
}

const openAlways = 'Mo-Su,PH 00:00-24:00';
const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
  dayjs().day(i).format('dd')
);

const LocalStoreEditForm = ({
  form,
  selectedRow,
  setStoreFormValue,
  remove,
  selectedRetailerName,
  setIsDataSourceValid,
  setAreAlternatePSCodesValid,
  onDeleteLocalStore,
  onClose,
  duplicateData
}: ILocalStoreEditForm<IUnityLocalStoreOverview>) => {
  // Aliases
  const { t } = useTranslation();

  //Local State
  const [dataSourcesData, setDataSourcesData] = useState<
    IDataSourceValueProps[]
  >([]);
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const localForm = { ...form };
  const [hourSelectorValue, setHourSelectorValue] = useState(
    selectedRow?.storeHours?.[0] === 'Mo-Su,PH 00:00-24:00'
      ? 'alwaysOpen'
      : 'custom'
  );
  // State to keep track of the schedule for each day
  const [schedule, setSchedule] = useState<ScheduleState>({
    Mo: { from: '', to: '', closed: false },
    Tu: { from: '', to: '', closed: false },
    We: { from: '', to: '', closed: false },
    Th: { from: '', to: '', closed: false },
    Fr: { from: '', to: '', closed: false },
    Sa: { from: '', to: '', closed: false },
    Su: { from: '', to: '', closed: false }
  });
  // store changed schedules
  const [changedSchedules, setChangedSchedules] = useState<
    Record<keyof ScheduleState, Schedule>
  >({
    Mo: { from: '', to: '', closed: false },
    Tu: { from: '', to: '', closed: false },
    We: { from: '', to: '', closed: false },
    Th: { from: '', to: '', closed: false },
    Fr: { from: '', to: '', closed: false },
    Sa: { from: '', to: '', closed: false },
    Su: { from: '', to: '', closed: false }
  });

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

  // We should keep geocodes as numbers
  const handleTextFieldValue = (
    key: keyof IUnityCreateLocalStore,
    value: string | number
  ) => {
    value === ''
      ? remove(key)
      : setStoreFormValue(
          key,
          (typeof value !== 'number' ? value.toString() : value) as
            | string
            | IUnityGeoCodes
        );
  };

  const handleHourSelector = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHourSelectorValue(event.target.value);
  };

  const handleUpdateSocialMediaUrl = (
    platform: IUnitySocialMediaTypes,
    url: string
  ) => {
    updateSocialMediaUrlEditForm(
      form.socialMediaURLs,
      (urls) => setStoreFormValue('socialMediaURLs', urls),
      platform,
      url
    );
  };

  // Update the schedule when OpenHours component changes
  const handleScheduleChange = (
    day: keyof ScheduleState,
    newSchedule: Schedule
  ) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: newSchedule
    }));

    setChangedSchedules((prevChangedSchedules) => ({
      ...prevChangedSchedules,
      [day]: newSchedule
    }));
  };

  const handleDeleteLocalStore = async () => {
    setIsDeleteButtonLoading(true);
    if (onDeleteLocalStore) {
      await onDeleteLocalStore();
      setIsDeleteButtonLoading(false);
      setIsDeleteDialogOpen(false);
      onClose && onClose();
    }
  };

  const isDuplicate = useMemo(() => {
    return !!(
      duplicateData &&
      Object.keys(duplicateData).length === 5 &&
      form?.name === duplicateData?.duplicateName &&
      form?.address?.street1 === duplicateData?.duplicateStreet &&
      form?.address?.city === duplicateData?.duplicateCity &&
      form?.address?.stateOrProvidence === duplicateData?.duplicateState &&
      form?.address?.postalCode === duplicateData?.duplicatePostcode
    );
  }, [
    duplicateData,
    form?.name,
    form?.address?.street1,
    form?.address?.city,
    form?.address?.stateOrProvidence,
    form?.address?.postalCode
  ]);

  useEffect(() => {
    // Logic for updating form based on dataSourcesData

    setStoreFormValue('dataSources', transformDataSource(dataSourcesData));
  }, [dataSourcesData, setStoreFormValue]);

  useEffect(() => {
    setStoreFormValue('status', form.status ?? 'inactive');
  }, []);

  useEffect(() => {
    setStoreFormValue('name', selectedRow?.name ?? '');
    setStoreFormValue(
      'geoCode.longitude' as keyof IUnityCreateLocalStore,
      String(selectedRow?.geoCode?.longitude ?? '')
    );
    setStoreFormValue(
      'geoCode.latitude' as keyof IUnityCreateLocalStore,
      String(selectedRow?.geoCode?.latitude ?? '')
    );
    setStoreFormValue(
      'address.city' as keyof IUnityCreateLocalStore,
      selectedRow?.address?.city ?? ''
    );
    setStoreFormValue(
      'address.street1' as keyof IUnityCreateLocalStore,
      selectedRow?.address?.street1 ?? ''
    );
    setStoreFormValue(
      'address.street2' as keyof IUnityCreateLocalStore,
      selectedRow?.address?.street2 ?? ''
    );
    setStoreFormValue(
      'address.stateOrProvidence' as keyof IUnityCreateLocalStore,
      selectedRow?.address?.stateOrProvidence ?? ''
    );
    setStoreFormValue(
      'address.postalCode' as keyof IUnityCreateLocalStore,
      selectedRow?.address?.postalCode ?? ''
    );
    setStoreFormValue('alternatePSCodes', selectedRow?.alternatePSCodes ?? []);
    setStoreFormValue('dataSources', selectedRow?.dataSources ?? []);
    setStoreFormValue('socialMediaURLs', selectedRow?.socialMediaURLs ?? []);

    const transformedArray = selectedRow?.dataSources?.map((item) => ({
      'dataSources.sourceType': item?.sourceType,
      'dataSources.source': item?.source,
      'dataSources.method': item?.method,
      'dataSources.currencyCode': item?.currencyCode,
      'dataSources.languageCode': item?.languageCode
    }));

    if (transformedArray) {
      setDataSourcesData(transformedArray);
    }
  }, [setStoreFormValue, selectedRow]);

  useEffect(() => {
    if (hourSelectorValue === 'custom') {
      handleTextFieldValue(
        'storeHours',
        generateScheduleString(changedSchedules)
      );
    } else {
      handleTextFieldValue('storeHours', openAlways);
    }
  }, [changedSchedules, hourSelectorValue]);

  useEffect(() => {
    // Logic for updating form based on dataSourcesData

    setStoreFormValue('dataSources', transformDataSource(dataSourcesData));
  }, [dataSourcesData, setStoreFormValue]);

  useEffect(() => {
    setStoreFormValue('status', form.status ?? 'inactive');
  }, []);

  useEffectOnce(() => {
    setSchedule(parseScheduleString(String(selectedRow?.storeHours)));

    setChangedSchedules(parseScheduleString(String(selectedRow?.storeHours)));
  });

  // Update the state of isAlternatePSCode based on whether there's an item in form.alternatePSCodes with an empty sourceEntityID.
  useEffect(() => {
    const hasEmptySourceEntityID =
      form.alternatePSCodes?.some((item) => item.sourceEntityID === '') ??
      false;
    setAreAlternatePSCodesValid(!hasEmptySourceEntityID);
  }, [form?.alternatePSCodes, setAreAlternatePSCodesValid]);

  return (
    <>
      <Stack spacing={2} sx={{ p: 3 }}>
        <DrawerTitleCard selectedRetailerName={selectedRetailerName} />
        <Stack spacing={2}>
          {isDuplicate && (
            <Alert color="error">
              {t('backoffice.retailers.importer.errors.duplicateLocalStore')}
            </Alert>
          )}
          <Typography variant="overline" color="text.secondary">
            {t('backoffice.common.basicInfo')}
          </Typography>
          <TextField
            size="small"
            label={t('backoffice.retailers.importer.create.storeName')}
            variant="outlined"
            defaultValue={selectedRow?.name ?? ''}
            onChange={(event) =>
              handleTextFieldValue('name', event.target.value)
            }
            error={!form.name || isDuplicate}
            helperText={
              !form.name
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
            defaultValue={
              selectedRow?.storeType &&
              toCamelCase(selectedRow?.storeType?.replace('_', ' '))
            }
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
                IUnityCreateLocalStore,
                keyof IUnityCreateLocalStore
              >('storeType', mappedValue, setStoreFormValue, remove);
            }}
          />
          <TextField
            size="small"
            label={t('backoffice.common.longitude')}
            variant="outlined"
            type="number"
            defaultValue={selectedRow?.geoCode?.latitude ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'geoCode.longitude' as keyof IUnityCreateLocalStore,
                parseFloat(event.target.value)
              )
            }
          />
          <TextField
            size="small"
            label={t('backoffice.common.latitude')}
            variant="outlined"
            type="number"
            defaultValue={selectedRow?.geoCode?.longitude ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'geoCode.latitude' as keyof IUnityCreateLocalStore,
                parseFloat(event.target.value)
              )
            }
          />
          <TextField
            size="small"
            label={t('backoffice.retailers.importer.create.storeExternalID')}
            variant="outlined"
            defaultValue={selectedRow?.storeExternalID ?? ''}
            onChange={(event) =>
              handleTextFieldValue('storeExternalID', event.target.value)
            }
          />
          <Typography variant="overline" color="text.secondary">
            {t('backoffice.common.address')}
          </Typography>
          <TextField
            size="small"
            label={t('backoffice.common.name')}
            variant="outlined"
            defaultValue={selectedRow?.address?.name ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'address.name' as keyof IUnityCreateLocalStore,
                event.target.value
              )
            }
          />
          <TextField
            size="small"
            label={`${t('backoffice.common.street')} 1`}
            variant="outlined"
            defaultValue={selectedRow?.address?.street1 ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'address.street1' as keyof IUnityCreateLocalStore,
                event.target.value
              )
            }
            error={
              !form?.['address.street1' as keyof IUnityCreateLocalStore] ||
              isDuplicate
            }
            helperText={
              !form?.['address.street1' as keyof IUnityCreateLocalStore]
                ? t('backoffice.retailers.importer.errors.mandatoryStreet')
                : ''
            }
          />
          <TextField
            size="small"
            label={`${t('backoffice.common.street')} 2`}
            variant="outlined"
            defaultValue={selectedRow?.address?.street2 ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'address.street2' as keyof IUnityCreateLocalStore,
                event.target.value
              )
            }
          />
          <TextField
            size="small"
            label={t('backoffice.common.city')}
            variant="outlined"
            defaultValue={selectedRow?.address?.city ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'address.city' as keyof IUnityCreateLocalStore,
                event.target.value
              )
            }
            error={
              !form?.['address.city' as keyof IUnityCreateLocalStore] ||
              isDuplicate
            }
            helperText={
              !form?.['address.city' as keyof IUnityCreateLocalStore]
                ? t('backoffice.retailers.importer.errors.mandatoryCity')
                : ''
            }
          />
          <TextField
            size="small"
            label={t('backoffice.common.state')}
            variant="outlined"
            defaultValue={selectedRow?.address?.stateOrProvidence ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'address.stateOrProvidence' as keyof IUnityCreateLocalStore,
                event.target.value
              )
            }
            error={
              !form?.[
                'address.stateOrProvidence' as keyof IUnityCreateLocalStore
              ] || isDuplicate
            }
            helperText={
              !form?.[
                'address.stateOrProvidence' as keyof IUnityCreateLocalStore
              ]
                ? t('backoffice.retailers.importer.errors.mandatoryState')
                : ''
            }
          />
          <TextField
            size="small"
            label={t('backoffice.common.postcode')}
            variant="outlined"
            defaultValue={selectedRow?.address?.postalCode ?? ''}
            onChange={(event) =>
              handleTextFieldValue(
                'address.postalCode' as keyof IUnityCreateLocalStore,
                event.target.value
              )
            }
            error={
              !form?.['address.postalCode' as keyof IUnityCreateLocalStore] ||
              isDuplicate
            }
            helperText={
              !form?.['address.postalCode' as keyof IUnityCreateLocalStore]
                ? t('backoffice.retailers.importer.errors.mandatoryPostcode')
                : ''
            }
          />

          {Boolean(selectedRow?.alternatePSCodes?.length ?? 0) && (
            <Typography variant="overline">
              {t('backoffice.common.alternateCodes')}
            </Typography>
          )}

          {Boolean(selectedRow?.alternatePSCodes?.length ?? 0) &&
            selectedRow?.alternatePSCodes?.map(
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
                      event.target.checked ? 'active' : 'inactive'
                    )
                  }
                  defaultChecked={
                    selectedRow?.status?.toLowerCase() === 'active'
                  }
                />
              }
              label={t('backoffice.retailers.importer.create.setActive')}
            />
          </FormGroup>
          {/*HERE ADD DATA SOURCES*/}
          <Typography variant="overline" color="text.secondary">
            {t('backoffice.retailers.importer.create.dataSources')}
          </Typography>
          {Array.isArray(localForm?.dataSources) &&
            dataSourcesData.map((data, index) => (
              <DataSources<IUnityCreateLocalStore, keyof IUnityCreateLocalStore>
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
          <Typography variant="overline" color="text.secondary">
            {t('backoffice.retailers.importer.create.storeHours')}
          </Typography>
          <FormControl sx={{ display: 'flex' }}>
            <RadioGroup
              value={hourSelectorValue}
              onChange={handleHourSelector}
              row
            >
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label={t('backoffice.common.custom')}
              />
              <FormControlLabel
                value="alwaysOpen"
                control={<Radio />}
                label={`${t('backoffice.common.open')} 24/7`}
              />
            </RadioGroup>
          </FormControl>
          {/* Open hour Selectors */}
          {hourSelectorValue === 'custom' &&
            daysOfWeek.map((day) => (
              <span key={day}>
                <OpenHours
                  day={day as keyof ScheduleState}
                  schedule={schedule[day as keyof ScheduleState]}
                  onChange={handleScheduleChange}
                />
              </span>
            ))}
          {/* Social Media */}
          <Typography variant="overline" color="text.secondary">
            {t('backoffice.retailers.importer.create.socialMedia')}
          </Typography>
          <TextField
            fullWidth
            size="small"
            label="Facebook"
            variant="outlined"
            defaultValue={
              selectedRow?.socialMediaURLs
                ?.filter((item) => item.platform === 'Facebook')
                .map((item) => item.url) ?? ''
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
              selectedRow?.socialMediaURLs
                ?.filter((item) => item.platform === 'Instagram')
                .map((item) => item.url) ?? ''
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
              selectedRow?.socialMediaURLs
                ?.filter((item) => item.platform === 'X')
                .map((item) => item.url) ?? ''
            }
            onChange={(event) =>
              handleUpdateSocialMediaUrl('X', event.target.value)
            }
          />
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
        title={t('backoffice.retailers.importer.delete.delete1pStore')}
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
              onClick={handleDeleteLocalStore}
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

export default LocalStoreEditForm;
