import DayClient from './DayClient';
import { getEventsByDate } from '@/lib/repositories/event';
import { CalendarProvider } from '@/app/_context/CalendarContext';

type Props = {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
};

export default async function DayPage({ params }: Props) {
  const { year, month, day } = await params;

  const yearNum = Number(year);
  const monthNum = Number(month);
  const dayNum = Number(day);

  if (Number.isNaN(yearNum) || Number.isNaN(monthNum) || Number.isNaN(dayNum)) {
    return <div>Invalid date</div>;
  }

  const events = await getEventsByDate(yearNum, monthNum, dayNum);

  return (
    <CalendarProvider initialEvents={events}>
      <DayClient year={yearNum} month={monthNum} day={dayNum} />
    </CalendarProvider>
  );
}
