'use client';
import { useCalendar } from '@/app/_context/CalendarContext';
import ViewSwitcher from '@/app/components/ViewSwitcher';
import DayEvents from '@/app/day/_components/DayEvents';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import Link from 'next/link';
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

  const [year, month, day] = date.split('-');
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);
  const [creating, setCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  return (
    <>
      <ViewSwitcher
        year={yearNumber}
        month={monthNumber}
        day={dayNumber}
        active="day"
      />
      <h1 className="mb-4 text-xl font-bold">
        {year}年{month}月{day}日
      </h1>

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
      <Link
        href={`/week/${year}/${month}/${day}`}
        className="text-blue-500 underline"
      >
        週表示を見る
      </Link>
      <DayEvents date={date} />
    </>
  );
}
