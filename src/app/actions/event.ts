'use server';

import { prisma } from '@/lib/prisma';
import { buildDateTimeRange } from '@/lib/date';

type CreateEventInput = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
};

export async function createEvent(input: CreateEventInput) {
  const { start, end } = buildDateTimeRange(
    input.date,
    input.startTime,
    input.endTime
  );

  return prisma.event.create({
    data: {
      title: input.title,
      startTime: start,
      endTime: end,
    },
  });
}

export async function updateEvent(input: {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const { start, end } = buildDateTimeRange(
    input.date,
    input.startTime,
    input.endTime
  );

  return prisma.event.update({
    where: { id: input.id },
    data: {
      title: input.title,
      startTime: start,
      endTime: end,
    },
  });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}
