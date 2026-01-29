'use client';

import { useCalendar } from '@/app/_context/CalendarContext';
import DayEvents from '@/app/(calendar)/day/_components/DayEvents';
import { getWeekCalendarDates, isTodayDate } from '@/lib/calendar';
import { formatDateKey } from '@/lib/date';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import Link from 'next/link';
import { useState } from 'react';

type PropsType = {
  year: string;
  month: string;
  day: string;
};

export default function WeekClient({ year, month, day }: PropsType) {
  const { events } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultStartTime, setDefaultStartTime] = useState<
    string | undefined
  >();

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);

  if (
    Number.isNaN(yearNumber) ||
    Number.isNaN(monthNumber) ||
    Number.isNaN(dayNumber)
  ) {
    return <div>Invalid date</div>;
  }

  const dates = getWeekCalendarDates(yearNumber, monthNumber, dayNumber);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <>
      <div className="flex flex-col relative h-full min-h-0 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] text-center text-sm font-medium">
            <div />
            {dates.map((date) => (
              <div key={date.toISOString()} className="py-2">
                <div className="text-xs">
                  {['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}
                </div>
                <Link
                  href={`/day/${yearNumber}/${monthNumber}/${date.getDate()}`}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${
                    isTodayDate(date) ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {date.getDate()}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          <div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-200 text-xs text-gray-500"
              >
                {hour}:00
              </div>
            ))}
          </div>

          {dates.map((date) => {
            const dateKey = formatDateKey(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate()
            );

            const dayEvents = events.filter((event) => event.date === dateKey);

            const timeToMinutes = (time: string) => {
              const [h, m] = time.split(':').map(Number);
              return h * 60 + m;
            };

            const MINUTE_HEIGHT = 64 / 60;

            return (
              <div
                key={date.toISOString()}
                className="relative border-l border-gray-200 hover:bg-blue-50"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickOffsetY = e.clientY - rect.top;
                  const clickedMinutes = Math.floor(
                    clickOffsetY / MINUTE_HEIGHT
                  );
                  const startHour = Math.floor(clickedMinutes / 60);

                  setDefaultStartTime(
                    `${String(startHour).padStart(2, '0')}:00`
                  );
                  setSelectedDate(
                    formatDateKey(yearNumber, monthNumber, date.getDate())
                  );
                  setEditingEvent(null);
                }}
              >
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-b border-gray-200" />
                ))}

                {dayEvents.map((event) => {
                  const start = timeToMinutes(event.startTime);
                  const end = timeToMinutes(event.endTime);

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                        setSelectedDate(event.date);
                      }}
                      className="absolute rounded bg-blue-500 p-1 text-xs text-white"
                      style={{
                        top: start * MINUTE_HEIGHT,
                        height: (end - start) * MINUTE_HEIGHT,
                        width: '100%',
                      }}
                    >
                      <div className="font-bold">{event.title}</div>
                      <div className="text-[10px]">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <DayEvents
          key={editingEvent?.id ?? selectedDate}
          date={selectedDate}
          editingEvent={editingEvent}
          defaultStartTime={defaultStartTime}
          autoOpen
          onClose={() => {
            setSelectedDate(null);
            setEditingEvent(null);
          }}
        />
      )}
    </>
  );
}
