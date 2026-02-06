'use client';

import MiniMonthCalendar from '@/app/components/monthCalendar';
import { useCalendar } from '../_context/CalendarContext';

export default function Sidebar() {
  const { createDate, openCreate } = useCalendar();

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toLocaleDateString('sv-SE');

  return (
    <aside className="w-64 shrink-0 h-full bg-gray-50 px-4 py-5">
      <button
        type="button"
        onClick={() => openCreate(createDate ?? today)}
        className="mb-6 rounded-full bg-blue-500 px-4 py-2 text-sm text-white"
      >
        ＋ 作成
      </button>

      <div className="mb-2 text-xs font-semibold text-gray-500">
        マイカレンダー
      </div>

      <MiniMonthCalendar />
    </aside>
  );
}
