import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title: body.title,
      date: body.date,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
