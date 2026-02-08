'use client';

import { CalendarEvent } from '@/lib/types/calendarEvent';
import { createContext, ReactNode, useContext, useState } from 'react';
import {
  createEvent as createEventAction,
  updateEvent as updateEventAction,
  deleteEvent as deleteEventAction,
} from '@/app/actions/event';

type CalendarContextType = {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider = ({
  children,
  initialEvents,
}: {
  children: ReactNode;
  initialEvents: CalendarEvent[];
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = async (event: CalendarEvent): Promise<void> => {
    const saved = await createEventAction({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
    });
    const newEvent: CalendarEvent = {
      ...saved,
      startTime: new Date(saved.startTime),
      endTime: new Date(saved.endTime),
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = async (event: CalendarEvent): Promise<void> => {
    const saved = await updateEventAction({
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
    });

    setEvents((prev) =>
      prev.map((e) =>
        e.id === saved.id
          ? {
              id: saved.id,
              title: saved.title,
              startTime: new Date(saved.startTime),
              endTime: new Date(saved.endTime),
            }
          : e
      )
    );
  };

  const deleteEvent = async (id: string): Promise<void> => {
    await deleteEventAction(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context)
    throw new Error('useCalendar must be used within CalendarProvider');
  return context;
};
