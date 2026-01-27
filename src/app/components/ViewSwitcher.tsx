'use client';
import Link from 'next/link';

type Props = {
  year: number;
  month: number;
  day: number;
  active: 'month' | 'week' | 'day';
};

export default function ViewSwitcher({ year, month, day, active }: Props) {
  const base = 'rounded px-3 py-1 text-sm';
  const activeStyle = 'bg-blue-500 text-white';
  const normalStyle = 'hover:bg-gray-100';

  return (
    <div className="mb-4 flex justify-end gap-1">
      <Link
        href={`/month/${year}/${month}`}
        className={`${base} ${active === 'month' ? activeStyle : normalStyle}`}
      >
        月
      </Link>

      <Link
        href={`/week/${year}/${month}/${day}`}
        className={`${base} ${active === 'week' ? activeStyle : normalStyle}`}
      >
        週
      </Link>

      <Link
        href={`/day/${year}/${month}/${day}`}
        className={`${base} ${active === 'day' ? activeStyle : normalStyle}`}
      >
        日
      </Link>
    </div>
  );
}
