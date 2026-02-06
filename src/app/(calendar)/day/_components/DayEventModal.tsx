'use client';

import { useCalendar } from '@/app/_context/CalendarContext';
import { addHoursToTime, buildDateTimeRange, formatTime } from '@/lib/date';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useState } from 'react';

type Props = {
  date: string;
  editingEvent?: CalendarEvent | null;
  defaultStartTime?: string | null;
  forceCreate?: boolean;
  allowDateEdit?: boolean;
  onClose: () => void;
};

export default function DayEventModal({
  date,
  editingEvent,
  defaultStartTime,
  forceCreate = false,
  allowDateEdit = false,
  onClose,
}: Props) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();

  const [title, setTitle] = useState(editingEvent?.title ?? '');
  const [eventDate, setEventDate] = useState(
    editingEvent?.startTime
      ? editingEvent.startTime.toLocaleDateString('sv-SE')
      : date ?? new Date().toLocaleDateString('sv-SE')
  );
  const [startTime, setStartTime] = useState(
    editingEvent
      ? formatTime(editingEvent.startTime)
      : defaultStartTime ?? '09:00'
  );

  const [endTime, setEndTime] = useState(
    editingEvent
      ? formatTime(editingEvent.endTime)
      : defaultStartTime
      ? addHoursToTime(defaultStartTime, 1)
      : '10:00'
  );

  const saveHandler = async () => {
    if (!title.trim()) return;

    const { start, end } = buildDateTimeRange(eventDate, startTime, endTime);
    if (end <= start) return;

    const isCreate = forceCreate || !editingEvent;

    if (!isCreate && editingEvent) {
      await updateEvent({
        ...editingEvent,
        title,
        startTime: start,
        endTime: end,
      });
    } else {
      await addEvent({
        id: crypto.randomUUID(),
        title,
        startTime: start,
        endTime: end,
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
          {editingEvent && (
            <button
              onClick={async () => {
                await deleteEvent(editingEvent.id);

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
