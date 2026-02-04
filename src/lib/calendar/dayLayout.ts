import { CalendarEvent } from '@/lib/types/calendarEvent';

const minutesFromDate = (date: Date): number => {
  return date.getHours() * 60 + date.getMinutes();
};

export type DayEventLayout = CalendarEvent & {
  startMinutes: number;
  endMinutes: number;
  widthPercent: number;
  offsetLeftPercent: number;
};

export const buildDayEventLayout = (
  events: CalendarEvent[]
): DayEventLayout[] => {
  return events.map((event) => {
    const startMinutes = minutesFromDate(event.startTime);
    const endMinutes =
      event.endTime.getHours() === 0 && event.endTime.getMinutes() === 0
        ? 24 * 60
        : minutesFromDate(event.endTime);

    const overlaps = events.filter(
      (e) => e.startTime < event.endTime && e.endTime > event.startTime
    );

    const index = overlaps.findIndex((e) => e.id === event.id);
    const widthPercent = 100 / overlaps.length;

    return {
      ...event,
      startMinutes,
      endMinutes,
      widthPercent,
      offsetLeftPercent: widthPercent * index,
    };
  });
};
