import { CalendarProvider } from '@/app/_context/CalendarContext';
import MonthClient from './MonthClient';
import { getEventsByMonth } from '@/lib/repositories/event/event.repository';

type PropsType = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export default async function MonthPage({ params }: PropsType) {
  const { year, month } = await params;

  const yearNumber = Number(year);
  const monthNumber = Number(month);

  const events = await getEventsByMonth(Number(year), Number(month));

  return (
    <CalendarProvider initialEvents={events}>
      <MonthClient year={yearNumber} month={monthNumber} />
    </CalendarProvider>
  );
}
