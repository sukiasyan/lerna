import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface Schedule {
  from: string;
  to: string;
  closed: boolean;
}

interface OpenHoursProps {
  day: keyof ScheduleState;
  schedule: Schedule;
  onChange: (day: keyof ScheduleState, newSchedule: Schedule) => void;
}

export interface ScheduleState {
  Mo: Schedule;
  Tu: Schedule;
  We: Schedule;
  Th: Schedule;
  Fr: Schedule;
  Sa: Schedule;
  Su: Schedule;
}

const OpenHours = ({ day, schedule, onChange }: OpenHoursProps) => {
  //Aliases
  const { t } = useTranslation();

  const handleChange =
    (type: 'from' | 'to') => (event: React.ChangeEvent<{ value: unknown }>) => {
      const value = event.target.value as string;
      onChange(day, { ...schedule, [type]: value });
    };

  const handleSwitchChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    // If the switch is turned on (closed), reset values
    const newSchedule = checked
      ? { from: '', to: '', closed: true }
      : { ...schedule, closed: false };
    onChange(day, newSchedule);
  };

  const hours = useMemo(
    () => Array.from({ length: 24 }, (_, index) => index),
    []
  );

  return (
    <Stack
      key={day}
      direction="row"
      sx={{
        display: 'flex',
        gap: '16px',
        alignSelf: 'stretch',
        marginBottom: '8px',
        alignItems: 'center',
        height: '40px'
      }}
    >
      <Typography variant="body1" sx={{ width: 30 }}>
        {t(`backoffice.common.shortWeekdays.${day}`)}
      </Typography>
      <FormControlLabel
        control={<Switch size="small" />}
        label={t('backoffice.common.closed')}
        checked={schedule.closed}
        // @ts-ignore
        onChange={handleSwitchChange}
      />

      {/* From Selector */}
      <FormControl size="small">
        <InputLabel>{t('backoffice.common.from')}</InputLabel>
        <Select
          value={schedule.from}
          label={t('backoffice.common.from')}
          // @ts-ignore
          onChange={handleChange('from')}
          sx={{ width: 90 }}
          disabled={schedule.closed}
        >
          {hours.map((hour) => (
            <MenuItem
              key={hour}
              value={`${hour.toString().padStart(2, '0')}:00`}
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* To Selector */}
      <FormControl size="small">
        <InputLabel>{t('backoffice.common.to')}</InputLabel>
        <Select
          value={schedule.to}
          label={t('backoffice.common.to')}
          // @ts-ignore
          onChange={handleChange('to')}
          sx={{ width: 90 }}
          disabled={schedule.closed}
        >
          {hours.map((hour) => (
            <MenuItem
              key={hour}
              value={`${hour.toString().padStart(2, '0')}:00`}
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default OpenHours;
