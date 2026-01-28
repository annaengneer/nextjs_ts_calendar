import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isToday,
  isSameMonth,
} from 'date-fns';

export const getMonthCalendarDates = (year: number, month: number): Date[] => {
  const firstDayOfMonth = startOfMonth(new Date(year, month - 1));
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const dates: Date[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};

export const getWeekCalendarDates = (
  year: number,
  month: number,
  day: number
): Date[] => {
  const baseDate = new Date(year, month - 1, day);
  const startDate = startOfWeek(baseDate, { weekStartsOn: 0 });

  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
};

export const isCurrentMonth = (
  date: Date,
  year: number,
  month: number
): boolean => {
  return isSameMonth(date, new Date(year, month - 1));
};

export const isTodayDate = (date: Date): boolean => {
  return isToday(date);
};
