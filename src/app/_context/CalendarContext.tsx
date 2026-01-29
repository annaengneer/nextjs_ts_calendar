'use client';

import { Event as CalendarEvent } from '@/lib/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type CalendarContextType = {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  isCreateOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/events');
      if (!res.ok) return;
      const data = await res.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const addEvent = async (event: CalendarEvent) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      throw new Error('イベント追加に失敗しました');
    }

    const saveEvent = await res.json();
    setEvents((prev) => [...prev, saveEvent]);
  };

  const updateEvent = async (event: CalendarEvent) => {
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
      }),
    });

    if (!res.ok) {
      throw new Error('イベント更新に失敗しました');
    }

    const updatedEvent = await res.json();

    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
    );
  };

  const deleteEvent = async (id: string) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('イベント削除に失敗しました');
    }

    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        isCreateOpen,
        openCreate,
        closeCreate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('イベント追加に失敗しました');
  }
  return context;
};
