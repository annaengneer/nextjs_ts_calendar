import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isToday,
  isSameMonth,
  eachDayOfInterval,
} from 'date-fns';

export const getMonthCalendarDates = (year: number, month: number): Date[] => {
  const baseDate = new Date(year, month - 1);

  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(baseDate), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(baseDate), { weekStartsOn: 0 }),
  });
};

export const getWeekCalendarDates = (
  year: number,
  month: number,
  day: number
): Date[] => {
  const baseDate = new Date(year, month - 1, day);

  return eachDayOfInterval({
    start: startOfWeek(baseDate, { weekStartsOn: 0 }),
    end: endOfWeek(baseDate, { weekStartsOn: 0 }),
  });
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
