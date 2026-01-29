'use server';

import { prisma } from '@/lib/prisma';

export async function createCalendarEvent(data: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  return prisma.event.create({ data });
}

export async function updateCalendarEvent(
  id: string,
  data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  }
) {
  return prisma.event.update({
    where: { id },
    data,
  });
}

export async function deleteCalendarEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}
