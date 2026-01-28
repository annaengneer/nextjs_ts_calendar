'use client';

import MiniMonthCalendar from '@/lib/monthCalendar';

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-full bg-gray-50 px-4 py-5">
      <button
        className="
            mb-6 flex items-center gap-2
            rounded-full bg-blue-500 px-4 py-2
            text-sm font-medium text-white
            shadow-sm hover:bg-blue-600
        "
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
