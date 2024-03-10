import {
  Schedule,
  ScheduleState
} from '~/Views/Retailers/LocalStores/OpenHours.tsx';

export function generateScheduleString(
  schedule: Record<keyof ScheduleState, Schedule>
) {
  let scheduleString = '';

  Object.entries(schedule).forEach(([day, { from, to, closed }]) => {
    if (!closed && from && to) {
      scheduleString += `${day} ${from}-${to}; `;
    }
  });

  return scheduleString.trim();
}
