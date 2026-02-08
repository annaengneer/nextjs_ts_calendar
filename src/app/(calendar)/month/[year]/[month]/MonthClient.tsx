'use client';
import EventFormModal from '@/app/(calendar)/_components/EventFormModal';
import { useCalendar } from '@/app/_context/CalendarContext';
import {
  getMonthCalendarDates,
  isCurrentMonth,
  isTodayDate,
} from '@/lib/calendar';
import { formatDateKey } from '@/lib/date';
import { CalendarEvent } from '@/lib/types/calendarEvent';

import Link from 'next/link';

import { useMemo, useState } from 'react';

type PropsType = {
  year: number;
  month: number;
};

export default function MonthClient({ year, month }: PropsType) {
  const { events } = useCalendar();
  const [createDate, setCreateDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const dates = getMonthCalendarDates(year, month);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      const key = formatDateKey(
        event.startTime.getFullYear(),
        event.startTime.getMonth() + 1,
        event.startTime.getDate()
      );

      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });

    return map;
  }, [events]);

  const isCurrentMonthMap = useMemo(() => {
    const map = new Map<string, boolean>();

    dates.forEach((date) => {
      const key = formatDateKey(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      map.set(key, isCurrentMonth(date, year, month));
    });

    return map;
  }, [dates, year, month]);

  return (
    <>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between"></div>

        <div className="grid grid-cols-7 border-b text-center text-sm font-medium">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="py-3">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {dates.map((date) => {
            const dateKey = formatDateKey(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate()
            );

            const isToday = isTodayDate(date);
            const isCurrent = isCurrentMonthMap.get(dateKey) ?? false;

            const dayEvents = isCurrent ? eventsByDate.get(dateKey) ?? [] : [];

            return (
              <div
                key={date.toISOString()}
                className={`
                h-32 border p-1 border-gray-200
                ${isCurrent ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                hover:bg-blue-50
              `}
                onClick={() => {
                  if (!isCurrent) return;
                  setEditingEvent(null);
                  setCreateDate(dateKey);
                }}
              >
                <Link
                  href={`/day/${year}/${month}/${date.getDate()}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`
                  inline-flex h-6 w-6 items-center justify-center rounded-full
                  ${isToday ? 'bg-blue-500 text-white' : ''}
                `}
                  >
                    {date.getDate()}
                  </div>
                </Link>

                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded bg-blue-100 px-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCreateDate(null);
                      setEditingEvent(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {createDate && !editingEvent && (
        <EventFormModal
          date={createDate}
          mode="create"
          allowDateEdit
          onClose={() => setCreateDate(null)}
        />
      )}

      {editingEvent && (
        <EventFormModal
          date={formatDateKey(
            editingEvent.startTime.getFullYear(),
            editingEvent.startTime.getMonth() + 1,
            editingEvent.startTime.getDate()
          )}
          mode="edit"
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          allowDateEdit
        />
      )}
    </>
  );
}
