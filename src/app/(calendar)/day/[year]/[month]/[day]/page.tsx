import DayClient from './DayClient';
import { getEventsByDate } from '@/lib/events';
import { CalendarProvider } from '@/app/_context/CalendarContext';

export default async function DayPage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = await params;

  const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  const events = await getEventsByDate(date);

  return (
    <CalendarProvider initialEvents={events}>
      <DayClient date={date} />
    </CalendarProvider>
  );
}
