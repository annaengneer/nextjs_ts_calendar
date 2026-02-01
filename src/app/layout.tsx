import { CalendarProvider } from './_context/CalendarContext';
import './globals.css';
import { getEventsByMonth } from '@/lib/events';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const now = new Date();
  const events = await getEventsByMonth(now.getFullYear(), now.getMonth() + 1);

  return (
    <html lang="ja">
      <body>
        <CalendarProvider initialEvents={events}>{children}</CalendarProvider>
      </body>
    </html>
  );
}
