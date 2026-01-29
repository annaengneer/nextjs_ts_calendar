import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type PropsType = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: PropsType) {
  try {
    const { id } = await params;
    const { title, date, startTime, endTime } = await request.json();

    const event = await prisma.event.update({
      where: { id },
      data: { title, date, startTime, endTime },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'イベント更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: PropsType) {
  try {
    const { id } = await params;
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'イベント削除に失敗しました' },
      { status: 500 }
    );
  }
}
