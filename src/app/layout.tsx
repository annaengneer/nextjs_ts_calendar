import { CalendarProvider } from './_context/CalendarContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <CalendarProvider>{children}</CalendarProvider>
      </body>
    </html>
  );
}
