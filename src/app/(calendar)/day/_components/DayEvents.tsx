'use client';

import { useCalendar } from '@/app/_context/CalendarContext';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useState } from 'react';

type Props = {
  date: string;
  autoOpen?: boolean;
  editingEvent?: CalendarEvent | null;
  onClose?: () => void;
  showAddButton?: boolean;
  defaultStartTime?: string;
};

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function DayEvents({
  date,
  autoOpen = false,
  editingEvent,
  onClose,
  showAddButton,
  defaultStartTime,
}: Props) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();

  const normalizeDate = (date: string) => {
    const [y, m, d] = date.split('-');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const [isOpen, setIsOpen] = useState(autoOpen || Boolean(editingEvent));
  const [title, setTitle] = useState(editingEvent?.title ?? '');
  const [startTime, setStartTime] = useState(
    editingEvent?.startTime ?? defaultStartTime ?? '09:00'
  );
  const addOneHour = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const nextHour = Math.min(h + 1, 23);
    return `${String(nextHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const [endTime, setEndTime] = useState(
    editingEvent?.endTime ??
      (defaultStartTime ? addOneHour(defaultStartTime) : '10:00')
  );

  const [eventDate, setEventDate] = useState(
    editingEvent?.date ?? normalizeDate(date)
  );

  const resetForm = () => {
    setIsOpen(false);
    onClose?.();
  };

  const saveHandler = () => {
    if (!title.trim()) return;
    if (startTime >= endTime) return;

    if (editingEvent) {
      updateEvent({
        ...editingEvent,
        title,
        date: eventDate,
        startTime,
        endTime,
      });
    } else {
      addEvent({
        id: crypto.randomUUID(),
        title,
        date: eventDate,
        startTime,
        endTime,
      });
    }
    resetForm();
  };

  return (
    <>
      {showAddButton && !editingEvent && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          ＋予定を追加
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={resetForm}
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
              className={`${inputClass} mb-3`}
              placeholder="予定タイトル"
            />

            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={`${inputClass} mb-4`}
            />

            <div className="mb-4 flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
              <span className="text-gray-400">〜</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="mt-6 flex items-center justify-between">
              {editingEvent && (
                <button
                  onClick={() => {
                    deleteEvent(editingEvent.id);
                    resetForm();
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  削除
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={resetForm}
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
        </div>
      )}
    </>
  );
}
