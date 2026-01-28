import WeekClient from './WeekClient';

type PropsType = {
  params: {
    year: string;
    month: string;
    day: string;
  };
};

export default async function WeekPage({ params }: PropsType) {
  const { year, month, day } = await params;
  return <WeekClient year={year} month={month} day={day} />;
}
