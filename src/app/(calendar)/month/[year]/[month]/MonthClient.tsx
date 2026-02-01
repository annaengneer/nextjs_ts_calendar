'use client';
import { useCalendar } from '@/app/_context/CalendarContext';
import DayEvents from '@/app/(calendar)/day/_components/DayEvents';
import {
  getMonthCalendarDates,
  isCurrentMonth,
  isTodayDate,
} from '@/lib/calendar';
import { formatDateKey } from '@/lib/date';
import { CalendarEvent } from '@/lib/types/calendarEvent';

import Link from 'next/link';
import { useState } from 'react';

type PropsType = {
  year: string;
  month: string;
};

export default function MonthClient({ year, month }: PropsType) {
  const { events } = useCalendar();
  console.log('events:', events);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dates = getMonthCalendarDates(yearNumber, monthNumber);
  console.log(dates.length);
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
            const isCurrent = isCurrentMonth(date, yearNumber, monthNumber);

            const dayEvents = events.filter(
              (event) => event.date === dateKey && isCurrent
            );

            return (
              <div
                key={date.toISOString()}
                className={`
                h-32 border p-1 border-gray-200
                ${isCurrent ? 'bg-white' : 'bg-gray-100 text-gray-400'}
                hover:bg-blue-50
              `}
                onClick={() => {
                  setSelectedDate(dateKey);
                  setEditingEvent(null);
                }}
              >
                <Link
                  href={`/day/${yearNumber}/${monthNumber}/${date.getDate()}`}
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
                      setEditingEvent(event);
                      setSelectedDate(event.date);
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
      {selectedDate && (
        <DayEvents
          key={editingEvent ? editingEvent.id : 'new'}
          date={selectedDate}
          editingEvent={editingEvent}
          onClose={() => {
            setSelectedDate(null);
            setEditingEvent(null);
          }}
        />
      )}
    </>
  );
}
