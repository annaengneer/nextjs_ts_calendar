'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getMonthCalendarDates,
  isCurrentMonth,
  isTodayDate,
} from '@/lib/calendar';

export default function MiniMonthCalendar() {
  const params = useParams();

  const year = Number(params.year);
  const month = Number(params.month);

  if (!year || !month) return null;

  const dates = getMonthCalendarDates(year, month);

  return (
    <div className="mt-4">
      <div className="mb-1 text-center text-xs font-medium text-gray-700">
        {year}年 {month}月
      </div>

      <div className="grid grid-cols-7 text-center text-[9px] text-gray-400">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-xs">
        {dates.map((date) => {
          const isCurrent = isCurrentMonth(date, year, month);
          const isToday = isTodayDate(date);

          return (
            <Link
              key={date.toISOString()}
              href={`/day/${year}/${month}/${date.getDate()}`}
              className={`
                 mx-auto aspect-square w-6
                 flex items-center justify-center rounded-full
                ${
                  isToday
                    ? 'bg-blue-500 text-white'
                    : isCurrent
                    ? 'hover:bg-gray-200'
                    : 'text-gray-400'
                }
              `}
            >
              {date.getDate()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
