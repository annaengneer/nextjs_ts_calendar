import MonthClient from './MonthClient';

type PropsType = {
  params: {
    year: string;
    month: string;
  };
};

export default async function MonthPage({ params }: PropsType) {
  const { year, month } = await params;
  return <MonthClient year={year} month={month} />;
}
