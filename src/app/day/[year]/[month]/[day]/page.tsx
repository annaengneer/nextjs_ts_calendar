import { formatDateKey } from '@/lib/date';
import DayClient from './DayClient';

type PropsType = {
  params: {
    year: string;
    month: string;
    day: string;
  };
};

export default async function DayPage({ params }: PropsType) {
  const { year, month, day } = await params;
  const date = formatDateKey(Number(year), Number(month), Number(day));

  return <DayClient date={date} />;
}
