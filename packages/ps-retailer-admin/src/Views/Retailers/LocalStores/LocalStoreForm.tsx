import AddIcon from '@mui/icons-material/Add';
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

import {
  handleAutocompleteStoreType,
  mapStringToStoreType,
  storeTypesCaseTypes
} from '../Retailers.utils';

import {
  IUnityCreateLocalStore,
  IUnityGeoCodes,
  IUnitySocialMediaTypes,
  IUnityStatus,
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
import { IDuplicateLocalStoreProps } from '~/Views/Retailers/RetailerDrawer';
import { updateSocialMediaUrl } from '~/Views/Retailers/socialMediaUtils';

export interface ILocalStoreForm<T extends object> {
  form: IUnityCreateLocalStore;
  setStoreFormValue: <K extends keyof T>(key: K, value: T[K]) => void;
  remove: <K extends keyof T>(key: K) => void;
  selectedRetailerName: string | null;
  setIsDataSourceValid: Dispatch<SetStateAction<boolean>>;
  duplicateData: IDuplicateLocalStoreProps | undefined;
}

const openAlways = 'Mo-Su,PH 00:00-24:00';
const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
  dayjs().day(i).format('dd')
);

const LocalStoreForm = ({
  form,
  setStoreFormValue,
  remove,
  selectedRetailerName,
  setIsDataSourceValid,
  duplicateData
}: ILocalStoreForm<IUnityCreateLocalStore>) => {
  // Aliases
  const { t } = useTranslation();

  //Local State
  const [dataSourcesData, setDataSourcesData] = useState<
    IDataSourceValueProps[]
  >([]);

  const localForm = { ...form };
  const [hourSelectorValue, setHourSelectorValue] = useState('custom');
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
    updateSocialMediaUrl(
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

  const isDuplicate = useMemo(() => {
    return (
      duplicateData &&
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
    setStoreFormValue('status', form.status ?? IUnityStatus.ACTIVE);
  }, [form.status, setStoreFormValue]);

  return (
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
          onChange={(event) => handleTextFieldValue('name', event.target.value)}
          required={!form.name || isDuplicate}
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
          renderInput={(params) => <TextField {...params} label="Store Type" />}
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
          onChange={(event) =>
            handleTextFieldValue(
              'address.street1' as keyof IUnityCreateLocalStore,
              event.target.value
            )
          }
          required={
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
          onChange={(event) =>
            handleTextFieldValue(
              'address.city' as keyof IUnityCreateLocalStore,
              event.target.value
            )
          }
          required={
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
          onChange={(event) =>
            handleTextFieldValue(
              'address.stateOrProvidence' as keyof IUnityCreateLocalStore,
              event.target.value
            )
          }
          required={
            !form?.[
              'address.stateOrProvidence' as keyof IUnityCreateLocalStore
            ] || isDuplicate
          }
          helperText={
            !form?.['address.stateOrProvidence' as keyof IUnityCreateLocalStore]
              ? t('backoffice.retailers.importer.errors.mandatoryState')
              : ''
          }
        />
        <TextField
          size="small"
          label={t('backoffice.common.postcode')}
          variant="outlined"
          onChange={(event) =>
            handleTextFieldValue(
              'address.postalCode' as keyof IUnityCreateLocalStore,
              event.target.value
            )
          }
          required={
            !form?.['address.postalCode' as keyof IUnityCreateLocalStore] ||
            isDuplicate
          }
          helperText={
            !form?.['address.postalCode' as keyof IUnityCreateLocalStore]
              ? t('backoffice.retailers.importer.errors.mandatoryPostcode')
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
    </Stack>
  );
};

export default LocalStoreForm;
