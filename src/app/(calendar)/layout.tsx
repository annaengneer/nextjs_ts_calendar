'use client';

import { useCalendar } from '../_context/CalendarContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DayEventModal from '@/app/(calendar)/day/_components/DayEventModal';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CalendarShell>{children}</CalendarShell>;
}

function CalendarShell({ children }: { children: React.ReactNode }) {
  const { createDate, closeCreate } = useCalendar();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <Header />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className="w-64 shrink-0 border-r bg-gray-100">
          <Sidebar />
        </aside>

        <div className="flex-1 min-h-0 p-4 overflow-hidden bg-gray-50">
          <div className="flex h-full min-h-0 flex-col rounded-xl bg-white overflow-hidden">
            <main className="flex-1 min-h-0 overflow-y-auto p-4">
              {children}
            </main>
          </div>
        </div>
      </div>

      {createDate && (
        <DayEventModal date={createDate} onClose={closeCreate} allowDateEdit />
      )}
    </div>
  );
}
