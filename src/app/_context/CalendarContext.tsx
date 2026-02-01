'use client';
import { CalendarEvent } from '@/lib/types/calendarEvent';
import { createContext, ReactNode, useContext, useState } from 'react';

type CalendarContextType = {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => Promise<void>;
  updateEvent: (event: CalendarEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  isCreateOpen: boolean;
  selectedDate: string | null;
  editingEvent: CalendarEvent | null;
  openCreate: (date?: string) => void;
  closeCreate: () => void;
};

type ApiEvent = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const openCreate = (date?: string): void => {
    const safeDate = date ?? new Date().toLocaleDateString('sv-SE');

    setSelectedDate(safeDate);
    setEditingEvent(null);
    setIsCreateOpen(true);
  };
  const closeCreate = () => setIsCreateOpen(false);

  const addEvent = async (event: CalendarEvent): Promise<void> => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: event.title,
        date: event.date,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('API error:', text);
      throw new Error('イベント追加に失敗しました');
    }

    const saved: ApiEvent = await res.json();

    const converted: CalendarEvent = {
      ...saved,
      startTime: new Date(saved.startTime),
      endTime: new Date(saved.endTime),
    };

    setEvents((prev) => [...prev, converted]);
  };

  const updateEvent = async (event: CalendarEvent): Promise<void> => {
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: event.title,
        date: event.date,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
      }),
    });

    if (!res.ok) throw new Error('更新失敗');

    const saved = await res.json();

    setEvents((prev) =>
      prev.map((e) =>
        e.id === saved.id
          ? {
              ...saved,
              startTime: new Date(saved.startTime),
              endTime: new Date(saved.endTime),
            }
          : e
      )
    );
  };

  const deleteEvent = async (id: string): Promise<void> => {
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
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
        selectedDate,
        editingEvent,
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
