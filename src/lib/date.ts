import { addDays, format, isBefore, parse } from 'date-fns';

export const formatDateKey = (year: number, month: number, day: number) => {
  return new Date(year, month - 1, day).toLocaleDateString('sv-SE');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const addHoursToTime = (time: string, hoursToAdd: number): string => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(2000, 0, 1, h, m);
  date.setHours(date.getHours() + hoursToAdd);

  return format(date, 'HH:mm');
};

export const buildDateTimeRange = (
  date: string,
  startTime: string,
  endTime: string
) => {
  const start = parse(`${date} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());

  let end = parse(`${date} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());

  if (endTime === '00:00' && isBefore(end, start)) {
    end = addDays(end, 1);
  }

  return { start, end };
};
