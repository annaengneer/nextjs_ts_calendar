'use client';

import DayEvents from '@/app/(calendar)/day/_components/DayEvents';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useState } from 'react';
import { useCalendar } from '@/app/_context/CalendarContext';
type PropsType = {
  date: string;
};

export default function DayClient({ date }: PropsType) {
  const { events } = useCalendar();

  const dayEvents = events.filter((e) => e.date === date);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const HOUR_HEIGHT = 48;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

  const minutesFromDate = (d: Date) => d.getHours() * 60 + d.getMinutes();

  const dayOfWeek = new Date(`${date}T00:00:00`).getDay();

  const positionedEvents = dayEvents.map((event) => {
    const start = minutesFromDate(event.startTime);
    const end =
      event.endTime.getHours() === 0 && event.endTime.getMinutes() === 0
        ? 24 * 60
        : minutesFromDate(event.endTime);

    const overlaps = dayEvents.filter(
      (e) => e.startTime < event.endTime && e.endTime > event.startTime
    );

    const overlapIndex = overlaps.findIndex((e) => e.id === event.id);
    const width = 100 / overlaps.length;

    return {
      ...event,
      start,
      end,
      width,
      left: width * overlapIndex,
    };
  });

  const day = Number(date.split('-')[2]);
  const today = new Date().toLocaleDateString('sv-SE');
  const isToday = today === date;

  const [creating, setCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState<string>();
  const handleClose = () => {
    setCreating(false);
    setEditingEvent(null);
  };

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

      {/* 時間グリッド */}
      <div className="flex-1 overflow-y-auto">
        <div className="relative flex">
          <div className="sticky top-0 left-0 z-20 w-15 bg-white">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 pr-2 text-right text-xs text-gray-500"
              >
                {hour}:00
              </div>
            ))}
          </div>

          <div className="relative flex-1 cursor-pointer">
            <div
              className="absolute inset-0 pointer-events-none
              bg-[linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]"
              style={{ backgroundSize: `100% ${HOUR_HEIGHT}px` }}
            />

            <div
              className="absolute inset-0 z-0"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickOffsetY = e.clientY - rect.top;
                const clickedMinutes = Math.floor(clickOffsetY / MINUTE_HEIGHT);
                const startHour = Math.floor(clickedMinutes / 60);

                setDefaultStartTime(`${String(startHour).padStart(2, '0')}:00`);
                setCreating(true);
              }}
            />

            {positionedEvents.map((event) => {
              const top = event.start * MINUTE_HEIGHT;
              const height = (event.end - event.start) * MINUTE_HEIGHT;

              return (
                <div
                  key={event.id}
                  className="absolute z-10 rounded bg-blue-500 px-1 py-0.5 text-xs text-white"
                  style={{
                    top,
                    height,
                    width: `${event.width}%`,
                    left: `${event.left}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingEvent(event);
                  }}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-[11px] opacity-90">
                    {event.startTime.toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {event.endTime.toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {(creating || editingEvent) && (
        <DayEvents
          date={date}
          editingEvent={editingEvent}
          defaultStartTime={defaultStartTime}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
