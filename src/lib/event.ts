import { prisma } from './prisma';

export async function getCalendarEvent(start: string, end: string) {
  return prisma.event.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });
}
