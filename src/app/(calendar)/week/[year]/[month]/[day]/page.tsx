import { CalendarProvider } from '@/app/_context/CalendarContext';
import WeekClient from './WeekClient';
import { getEventsByWeek } from '@/lib/repositories/event';

type PropsType = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
};

export default async function WeekPage({ params }: PropsType) {
  const { year, month, day } = await params;

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  const events = await getEventsByWeek(y, m, d);

  return (
    <CalendarProvider initialEvents={events}>
      <WeekClient year={y} month={m} day={d} />
    </CalendarProvider>
  );
}
