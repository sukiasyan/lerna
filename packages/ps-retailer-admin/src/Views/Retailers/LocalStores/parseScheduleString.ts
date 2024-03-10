import {
  Schedule,
  ScheduleState
} from '~/Views/Retailers/LocalStores/OpenHours.tsx';

type ResultObject = {
  [day in keyof ScheduleState]: Schedule;
};

const parseTimeRange = (timeRange: string): { from: string; to: string } => {
  const [from, to] = timeRange.split('-');
  return { from, to };
};

const parseString = (daySchedule: string): ScheduleState | undefined => {
  const [day, timeRange] = daySchedule.split(' ');
  if (!day || !timeRange) {
    return undefined; // Invalid input, return undefined
  }

  const { from, to } = parseTimeRange(timeRange);

  // @ts-ignore
  return {
    [day as keyof ScheduleState]: {
      from,
      to,
      closed: false
    }
  };
};

const parseScheduleString = (storeHours?: string): ResultObject => {
  const result: ResultObject = {
    Su: { from: '', to: '', closed: false },
    Mo: { from: '', to: '', closed: false },
    Tu: { from: '', to: '', closed: false },
    We: { from: '', to: '', closed: false },
    Th: { from: '', to: '', closed: false },
    Fr: { from: '', to: '', closed: false },
    Sa: { from: '', to: '', closed: false }
  };

  if (storeHours && storeHours.trim() !== '') {
    const trimmedHours = storeHours.trim().replace(/;\s*$/, ''); // Remove trailing semicolon and whitespaces
    const scheduleArray = trimmedHours
      .split(';')
      .map((daySchedule) => parseString(daySchedule.trim()))
      .filter(Boolean) as ResultObject[];

    scheduleArray.forEach((schedule) => {
      const day = Object.keys(schedule)[0] as keyof ScheduleState;
      result[day] = schedule[day];
    });
  }

  return result;
};

export default parseScheduleString;
