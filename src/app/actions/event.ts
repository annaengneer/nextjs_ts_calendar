'use server';

import { prisma } from '@/lib/prisma';
import { buildDateTimeRange } from '@/lib/date';

type CreateEventInput = {
  title: string;
  startTime: Date;
  endTime: Date;
};

export async function createEvent(input: CreateEventInput) {
  const { startTime, endTime } = buildDateTimeRange(
    input.startTime,
    input.endTime
  );

  return prisma.event.create({
    data: {
      title: input.title,
      startTime,
      endTime,
    },
  });
}

export async function updateEvent(input: {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
}) {
  const { startTime, endTime } = buildDateTimeRange(
    input.startTime,
    input.endTime
  );

  return prisma.event.update({
    where: { id: input.id },
    data: {
      title: input.title,
      startTime,
      endTime,
    },
  });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}
