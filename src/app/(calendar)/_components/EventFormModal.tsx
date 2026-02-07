'use client';

import { useCalendar } from '@/app/_context/CalendarContext';
import { addHoursToTime, buildDateTimeRange, formatTime } from '@/lib/date';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useState } from 'react';

type Props = {
  date: string;
  defaultStartTime?: string | null;
  allowDateEdit?: boolean;
  mode: 'create' | 'edit';
  event?: CalendarEvent;
  onClose: () => void;
};

export default function EventFormModal({
  date,
  mode,
  event,
  defaultStartTime,
  allowDateEdit = false,
  onClose,
}: Props) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();

  const [title, setTitle] = useState(event?.title ?? '');
  const [eventDate, setEventDate] = useState(
    event ? event.startTime.toLocaleDateString('sv-SE') : date
  );

  const [startTime, setStartTime] = useState(
    event ? formatTime(event.startTime) : defaultStartTime ?? '09:00'
  );

  const [endTime, setEndTime] = useState(
    event
      ? formatTime(event.endTime)
      : defaultStartTime
      ? addHoursToTime(defaultStartTime, 1)
      : '10:00'
  );

  const saveHandler = async () => {
    if (!title.trim()) return;

    const start = new Date(`${eventDate}T${startTime}`);
    const end = new Date(`${eventDate}T${endTime}`);

    const { startTime: fixedStart, endTime: fixedEnd } = buildDateTimeRange(
      start,
      end
    );

    if (fixedEnd <= fixedStart) return;

    if (mode === 'edit' && event) {
      await updateEvent({
        id: event.id,
        title,
        startTime: fixedStart,
        endTime: fixedEnd,
      });
    } else {
      await addEvent({
        id: crypto.randomUUID(),
        title,
        startTime: fixedStart,
        endTime: fixedEnd,
      });
    }

    onClose();
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
          {mode === 'edit' ? '予定を編集' : '予定を追加'}
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
          disabled={!allowDateEdit}
          onChange={(e) => setEventDate(e.target.value)}
          className={`mb-4 w-full rounded-lg border px-3 py-2 text-sm
          ${!allowDateEdit ? 'bg-gray-100 text-gray-500' : ''}
        `}
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
          {mode === 'edit' && event && (
            <button
              onClick={async () => {
                await deleteEvent(event.id);
                onClose();
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
