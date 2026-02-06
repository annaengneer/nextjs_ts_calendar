'use client';

import DayEventModal from '@/app/(calendar)/day/_components/DayEventModal';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useState } from 'react';
import { useCalendar } from '@/app/_context/CalendarContext';
import { HOURS, MINUTES_PER_HOUR } from '@/lib/calendar/constants';
import { buildDayEventLayout } from '@/lib/calendar/dayLayout';
import { formatDateKey, formatTime } from '@/lib/date';
import { isToday as isTodayDate } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';

type PropsType = {
  year: number;
  month: number;
  day: number;
};

const HOUR_HEIGHT = 48;
const MINUTE_HEIGHT = HOUR_HEIGHT / MINUTES_PER_HOUR;

export default function DayClient({ year, month, day }: PropsType) {
  const { events } = useCalendar();
  const router = useRouter();
  const dayEventLayouts = buildDayEventLayout(events);

  const date = formatDateKey(year, month, day);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();
  const isToday = isTodayDate(dateObj);

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState<string | null>(null);
  const handleClose = () => {
    setEditingEvent(null);
    setDefaultStartTime(null);

    router.replace(`/day/${year}/${month}/${day}`);
  };

  const searchParams = useSearchParams();
  const isCreateFromUrl = searchParams.get('create') === '1';

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b bg-white">
        <div className="flex items-center justify-center py-2">
          <div className="text-center">
            <div className="text-xs text-gray-500">
              {['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]}
            </div>
            <div
              className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full
              ${isToday ? 'bg-blue-500 text-white' : 'text-gray-900'}`}
            >
              {day}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="relative flex">
          <div className="sticky top-0 left-0 z-20 w-15 bg-white">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-12 flex items-start justify-end pr-2 text-xs text-gray-500"
              >
                {hour}:00
              </div>
            ))}
          </div>

          <div className="relative flex-1">
            <div
              className="absolute inset-0 z-0"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;

                const minutes = Math.floor(y / MINUTE_HEIGHT);
                const hour = Math.floor(minutes / 60);

                setDefaultStartTime(`${String(hour).padStart(2, '0')}:00`);
                setEditingEvent(null);

                router.push(`/day/${year}/${month}/${day}?create=1`);
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, #d1d5db 1px, transparent 1px)',
                backgroundSize: `100% ${HOUR_HEIGHT}px`,
              }}
            />

            {dayEventLayouts.map((event) => {
              const top = event.startMinutes * MINUTE_HEIGHT;
              const height =
                (event.endMinutes - event.startMinutes) * MINUTE_HEIGHT;

              return (
                <div
                  key={event.id}
                  className="absolute z-10 rounded bg-blue-500 px-1 py-0.5 text-xs text-white"
                  style={{
                    top,
                    height,
                    width: `${event.widthPercent}%`,
                    left: `${event.offsetLeftPercent}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingEvent(event);
                  }}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-[11px] opacity-90">
                    {formatTime(event.startTime)}
                    {' - '}
                    {formatTime(event.endTime)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {(isCreateFromUrl || editingEvent) && (
        <DayEventModal
          date={date}
          editingEvent={editingEvent}
          defaultStartTime={defaultStartTime}
          allowDateEdit
          onClose={handleClose}
        />
      )}
    </div>
  );
}
