'use client';
import { useCalendar } from '@/app/_context/CalendarContext';

import DayEvents from '@/app/(calendar)/day/_components/DayEvents';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { useState } from 'react';

type PropsType = {
  date: string;
};

export default function DayClient({ date }: PropsType) {
  const { events } = useCalendar();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const MINUTE_HEIGHT = 64 / 60;

  const timeToMinutes = (time: string) => {
    const [hour, minutes] = time.split(':').map(Number);
    return hour * 60 + minutes;
  };

  const dayEvents = events
    .filter((e) => e.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const positionedEvents = dayEvents.map((event) => {
    const start = timeToMinutes(event.startTime);
    const end = timeToMinutes(event.endTime);

    const overlaps = dayEvents.filter((e) => {
      const s = timeToMinutes(e.startTime);
      const en = timeToMinutes(e.endTime);
      return s < end && en > start;
    });

    return {
      ...event,
      start,
      end,
      overlapCount: overlaps.length,
    };
  });

  const day = date.split('-')[2];
  const [creating, setCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const today = new Date();
  const isToday = today.toISOString().slice(0, 10) === date;

  return (
    <>
      <div className="relative h-full min-h-0 overflow-y-auto">
        <div className="sticky top-0 z-30 bg-white border-b">
          <div className="flex items-center justify-center py-2">
            <div className="text-center">
              <div className="text-xs text-gray-500">
                {
                  ['日', '月', '火', '水', '木', '金', '土'][
                    new Date(date).getDay()
                  ]
                }
              </div>

              <div
                className={`
                mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full
                ${isToday ? 'bg-blue-500 text-white' : 'text-gray-900'}
              `}
              >
                {day}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[60px_1fr]">
          <div>
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b text-xs text-gray-500">
                {hour}:00
              </div>
            ))}
          </div>

          <div
            className="relative cursor-pointer"
            onClick={() => {
              setEditingEvent(null);
              setCreating(true);
            }}
          >
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b" />
            ))}

            {positionedEvents.map((event, index) => {
              const top = event.start * MINUTE_HEIGHT;
              const height = (event.end - event.start) * MINUTE_HEIGHT;
              const width = 100 / event.overlapCount;
              const left = width * index;

              return (
                <div
                  key={event.id}
                  className="
                  absolute
                  z-10
                  overflow-hidden
                  rounded
                  bg-blue-500
                  p-2
                  text-xs
                  text-white
                    border
                border-white
                "
                  style={{
                    top,
                    height,
                    width: `${width}%`,
                    left: `${left}%`,
                  }}
                  onClick={() => setEditingEvent(event)}
                >
                  <div className="font-bold">{event.title}</div>
                  <div className="text-[10px]">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {(creating || editingEvent) && (
          <DayEvents
            date={date}
            editingEvent={editingEvent}
            autoOpen
            onClose={() => {
              setEditingEvent(null);
              setCreating(false);
            }}
          />
        )}
      </div>
    </>
  );
}
