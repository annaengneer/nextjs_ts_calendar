'use client';

import {
  getNextDay,
  getNextMonth,
  getNextWeek,
  getPrevDay,
  getPrevMonth,
  getPrevWeek,
} from '@/lib/calendarNav';
import {
  formatDayTitle,
  formatMonthTitle,
  formatWeekTitle,
} from '@/lib/formatDate';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Header() {
  const params = useParams();
  const pathname = usePathname();

  const year = Number(params.year);
  const month = Number(params.month);
  const day = params.day ? Number(params.day) : 1;

  const isMonth = pathname.startsWith('/month');
  const isWeek = pathname.startsWith('/week');
  const isDay = pathname.startsWith('/day');

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  let prevHref = '';
  let nextHref = '';

  let title = '';

  if (isMonth) {
    title = formatMonthTitle(year, month);
  }

  if (isWeek) {
    title = formatWeekTitle(year, month, day);
  }

  if (isDay) {
    title = formatDayTitle(year, month, day);
  }

  if (isMonth) {
    const prev = getPrevMonth(year, month);
    const next = getNextMonth(year, month);
    prevHref = `/month/${prev.year}/${prev.month}`;
    nextHref = `/month/${next.year}/${next.month}`;
  }

  if (isWeek) {
    const prev = getPrevWeek(year, month, day);
    const next = getNextWeek(year, month, day);
    prevHref = `/week/${prev.year}/${prev.month}/${prev.day}`;
    nextHref = `/week/${next.year}/${next.month}/${next.day}`;
  }

  if (isDay) {
    const prev = getPrevDay(year, month, day);
    const next = getNextDay(year, month, day);
    prevHref = `/day/${prev.year}/${prev.month}/${prev.day}`;
    nextHref = `/day/${next.year}/${next.month}/${next.day}`;
  }

  let todayHref = '';

  if (isMonth) {
    todayHref = `/month/${todayYear}/${todayMonth}`;
  }

  if (isWeek) {
    todayHref = `/week/${todayYear}/${todayMonth}/${todayDay}`;
  }

  if (isDay) {
    todayHref = `/day/${todayYear}/${todayMonth}/${todayDay}`;
  }

  return (
    <header className="flex h-16 items-center justify-between bg-gray-50 px-4">
      <div className="flex items-center gap-2">
        <button className="rounded-full p-2 text-gray-600 hover:bg-gray-200">
          ☰
        </button>
        <span className="text-lg font-medium">カレンダー</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={todayHref}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
        >
          今日
        </Link>
        <Link href={prevHref} className="rounded-full p-2 hover:bg-gray-100">
          ◀
        </Link>
        <div className="min-w-45 text-center text-sm font-medium">{title}</div>

        <Link href={nextHref} className="rounded-full p-2 hover:bg-gray-100">
          ▶
        </Link>
      </div>

      <div className="flex items-center gap-1 text-sm">
        <Link
          href={`/month/${year}/${month}`}
          className={`rounded px-3 py-1 ${
            isMonth ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
        >
          月
        </Link>
        <Link
          href={`/week/${year}/${month}/${day}`}
          className={`rounded px-3 py-1 ${
            isWeek ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
        >
          週
        </Link>
        <Link
          href={`/day/${year}/${month}/${day}`}
          className={`rounded px-3 py-1 ${
            isDay ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
          }`}
        >
          日
        </Link>
      </div>
    </header>
  );
}
