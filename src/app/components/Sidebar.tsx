'use client';

import { useState } from 'react';
import EventFormModal from '../(calendar)/_components/EventFormModal';
import MiniMonthCalendar from './monthCalendar';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date().toLocaleDateString('sv-SE');

  return (
    <aside className="w-64 shrink-0 h-full bg-gray-50 px-4 py-5">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          mb-6 flex items-center gap-2
          rounded-full bg-blue-500 px-4 py-2
          text-sm font-medium text-white
          shadow-sm hover:bg-blue-600
        "
      >
        ＋ 作成
      </button>
      <MiniMonthCalendar />

      {isOpen && (
        <EventFormModal
          date={today}
          mode="create"
          allowDateEdit
          onClose={() => setIsOpen(false)}
        />
      )}
    </aside>
  );
}
