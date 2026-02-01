import { prisma } from '@/lib/prisma';
import { CalendarEvent } from '@/lib/types/calendarEvent';

export async function getEventsByDate(date: string): Promise<CalendarEvent[]> {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T24:00:00`);
  return prisma.event.findMany({
    where: {
      startTime: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}

export async function getEventsByMonth(
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return prisma.event.findMany({
    where: {
      startTime: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}

export async function getEventsByWeek(
  year: number,
  month: number,
  day: number
): Promise<CalendarEvent[]> {
  const base = new Date(year, month - 1, day);

  const start = new Date(base);
  start.setDate(base.getDate() - base.getDay());

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return prisma.event.findMany({
    where: {
      startTime: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}
