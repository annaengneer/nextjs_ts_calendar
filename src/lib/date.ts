import { format } from 'date-fns';

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

export const buildDateTimeRange = (startTime: Date, endTime: Date) => {
  let end = endTime;

  if (end.getHours() === 0 && end.getMinutes() === 0 && end <= startTime) {
    end = new Date(end);
    end.setDate(end.getDate() + 1);
  }

  return {
    startTime,
    endTime: end,
  };
};
