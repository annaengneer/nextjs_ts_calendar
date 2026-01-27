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
};

export default function DayEvents({
  date,
  autoOpen = false,
  editingEvent,
  onClose,
  showAddButton,
}: Props) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();

  const normalizeDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const isEditing = Boolean(editingEvent);

  const [isOpen, setIsOpen] = useState<boolean>(autoOpen || isEditing);

  const [title, setTitle] = useState(editingEvent?.title ?? '');

  const [startTime, setStartTime] = useState(
    editingEvent?.startTime ?? '09:00'
  );

  const [endTime, setEndTime] = useState(editingEvent?.endTime ?? '10:00');

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
      <div>
        {showAddButton && !editingEvent && (
          <button
            onClick={() => setIsOpen(true)}
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            ＋予定を追加
          </button>
        )}

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-80 rounded bg-white p-4">
              <h2 className="mb-2 font-bold">
                {editingEvent ? '予定を編集' : '予定を追加'}
              </h2>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-3 w-full border p-2"
                placeholder="予定タイトル"
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mb-3 w-full border p-2"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mb-2 w-full border p-2"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mb-3 w-full border p-2"
              />
              <div className="flex justify-between">
                {editingEvent && (
                  <button
                    onClick={() => {
                      deleteEvent(editingEvent.id);
                      resetForm();
                    }}
                    className="text-sm text-red-500"
                  >
                    削除
                  </button>
                )}

                <div className="flex justify-end gap-2">
                  <button onClick={resetForm}>キャンセル</button>
                  <button
                    onClick={saveHandler}
                    className="rounded bg-blue-500 px-3 p-1 text-white"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
