import WeekClient from './WeekClient';
import { getEventsByWeek } from '@/lib/events';
import { CalendarProvider } from '@/app/_context/CalendarContext';

type PropsType = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
};

export default async function WeekPage({ params }: PropsType) {
  const { year, month, day } = await params;

  const events = await getEventsByWeek(
    Number(year),
    Number(month),
    Number(day)
  );

  return (
    <CalendarProvider initialEvents={events}>
      <WeekClient year={year} month={month} day={day} />
    </CalendarProvider>
  );
}
