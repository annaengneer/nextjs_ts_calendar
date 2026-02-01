'use client';

import { useCalendar } from '@/app/_context/CalendarContext';
import DayEvents from '@/app/(calendar)/day/_components/DayEvents';
import { getWeekCalendarDates, isTodayDate } from '@/lib/calendar';
import { formatDateKey } from '@/lib/date';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import Link from 'next/link';
import { useRef, useState } from 'react';

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dayNumber = Number(day);

  const HOUR_HEIGHT = 64;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

  if (
    Number.isNaN(yearNumber) ||
    Number.isNaN(monthNumber) ||
    Number.isNaN(dayNumber)
  ) {
    return <div>Invalid date</div>;
  }

  const dates = getWeekCalendarDates(yearNumber, monthNumber, dayNumber);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const eventDateKey = (e: CalendarEvent) => {
    const d = new Date(e.date);
    return formatDateKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
  };
  const minutesFromDate = (t: Date, isEnd = false) => {
    const h = t.getHours();
    const m = t.getMinutes();

    if (isEnd && h === 0 && m === 0) {
      return 24 * 60;
    }

    return h * 60 + m;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-30 bg-white border-b">
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

      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden bg-white"
      >
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="relative pr-2" style={{ height: HOUR_HEIGHT }}>
                <span className="absolute top-1 right-1 -translate-y-1/2 text-xs text-gray-500">
                  {hour}:00
                </span>
              </div>

              {dates.map((date) => {
                const dateKey = formatDateKey(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  date.getDate()
                );

                return (
                  <div
                    key={date.toISOString() + hour}
                    className="border-l border-t border-gray-200 hover:bg-blue-50"
                    style={{ height: HOUR_HEIGHT }}
                    onClick={() => {
                      setDefaultStartTime(
                        `${String(hour).padStart(2, '0')}:00`
                      );
                      setSelectedDate(dateKey);
                      setEditingEvent(null);

                      scrollRef.current?.scrollTo({
                        top: hour * HOUR_HEIGHT,
                        behavior: 'smooth',
                      });
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-20 grid grid-cols-[60px_repeat(7,1fr)] pointer-events-none">
          <div />
          {dates.map((date) => {
            const dateKey = formatDateKey(
              date.getFullYear(),
              date.getMonth() + 1,
              date.getDate()
            );

            const dayEvents = events.filter((e) => eventDateKey(e) === dateKey);

            return (
              <div key={dateKey} className="relative">
                {dayEvents.map((event) => {
                  const startMin = minutesFromDate(event.startTime);
                  const endMin = minutesFromDate(event.endTime, true);

                  if (endMin <= startMin) return null;

                  return (
                    <div
                      key={event.id}
                      className="absolute left-1 right-1 rounded bg-blue-500 p-1 text-xs text-white pointer-events-auto"
                      style={{
                        top: startMin * MINUTE_HEIGHT,
                        height: (endMin - startMin) * MINUTE_HEIGHT,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                        setSelectedDate(dateKey);
                      }}
                    >
                      <div className="font-bold">{event.title}</div>
                      <div className="text-[10px]">
                        {event.startTime.toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                        {' - '}
                        {event.endTime.toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
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
          onClose={() => {
            setSelectedDate(null);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}
