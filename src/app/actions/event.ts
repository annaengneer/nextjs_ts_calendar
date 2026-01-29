'use server';

import { prisma } from '@/lib/prisma';

export async function createEvent(data: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  return prisma.event.create({ data });
}
