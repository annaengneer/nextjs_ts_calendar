'use client';

import { useCalendar } from '@/app/_context/CalendarContext';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
type Props = {
  date: string;
  editingEvent?: CalendarEvent | null;
  defaultStartTime?: string;
  onClose?: () => void;
};

const toTime = (date: Date) => {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export default function DayEvents({
  date,
  editingEvent,
  defaultStartTime,
  onClose,
}: Props) {
  const router = useRouter();
  const { addEvent, updateEvent, deleteEvent } = useCalendar();

  const [title, setTitle] = useState(editingEvent?.title ?? '');
  const [eventDate, setEventDate] = useState(editingEvent?.date ?? date);
  const [startTime, setStartTime] = useState(
    editingEvent ? toTime(editingEvent.startTime) : defaultStartTime ?? '09:00'
  );
  const [endTime, setEndTime] = useState(
    editingEvent
      ? toTime(editingEvent.endTime)
      : defaultStartTime
      ? `${String(Number(defaultStartTime.slice(0, 2)) + 1).padStart(
          2,
          '0'
        )}:00`
      : '10:00'
  );

  const saveHandler = async () => {
    if (!title.trim()) return;

    const [y, m, d] = eventDate.split('-').map(Number);
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const startISO = new Date(y, m - 1, d, sh, sm, 0, 0);
    const endISO = new Date(y, m - 1, d, eh, em, 0, 0);
    if (endTime === '00:00' && startTime !== '00:00') {
      endISO.setDate(endISO.getDate() + 1);
    }

    if (endISO <= startISO) return;

    if (editingEvent) {
      await updateEvent({
        ...editingEvent,
        title,
        date: eventDate,
        startTime: startISO,
        endTime: endISO,
      });
    } else {
      const newEvent = {
        id: crypto.randomUUID(),
        title,
        date: eventDate,
        startTime: startISO,
        endTime: endISO,
      };

      await addEvent(newEvent);
    }

    router.refresh();
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-90 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {editingEvent ? '予定を編集' : '予定を追加'}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="予定タイトル"
          className="mb-3 w-full rounded-lg border px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="mb-4 w-full rounded-lg border px-3 py-2 text-sm"
        />

        <div className="mb-4 flex items-center gap-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <span className="text-gray-400">〜</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          {editingEvent && (
            <button
              onClick={async () => {
                await deleteEvent(editingEvent.id);
                router.refresh();
                onClose?.();
              }}
              className="mr-auto
                rounded-lg
                px-4 py-2
                text-sm
                text-red-500
                hover:bg-red-100"
            >
              削除
            </button>
          )}

          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            キャンセル
          </button>

          <button
            onClick={saveHandler}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
