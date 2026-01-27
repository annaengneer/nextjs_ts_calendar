'use client';
import { useCalendar } from '@/app/_context/CalendarContext';
import ViewSwitcher from '@/app/components/ViewSwitcher';
import DayEvents from '@/app/day/_components/DayEvents';
import {
  getMonthCalendarDates,
  getNextMonth,
  getPrevMonth,
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

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const dates = getMonthCalendarDates(yearNumber, monthNumber);

  const prev = getPrevMonth(yearNumber, monthNumber);
  const next = getNextMonth(yearNumber, monthNumber);

  return (
    <>
      <ViewSwitcher
        year={yearNumber}
        month={monthNumber}
        day={1}
        active="month"
      />
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Link
            href={`/month/${prev.year}/${prev.month}`}
            className="rounded px-3 py-1 hover:bg-gray-100"
          >
            ←前月
          </Link>

          <h1 className="mb-4 text-xl font-bold ">
            {yearNumber}年 {monthNumber}月
          </h1>
          <Link
            href={`/month/${next.year}/${next.month}`}
            className="rounded px-3 py-1 hover:bg-gray-100"
          >
            翌月→
          </Link>
        </div>

        <div className="grid grid-cols-7 border-b text-center text-sm font-medium">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {dates.map((date) => {
            const dateKey = formatDateKey(
              yearNumber,
              monthNumber,
              date.getDate()
            );
            const isCurrent = isCurrentMonth(date, yearNumber, monthNumber);
            const isToday = isTodayDate(date);

            const dayEvents = events.filter((event) => event.date === dateKey);

            return (
              <div
                key={date.toISOString()}
                className={`
                h-24 border p-1
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
          key={editingEvent?.id ?? selectedDate}
          date={selectedDate}
          editingEvent={editingEvent}
          showAddButton={false}
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
