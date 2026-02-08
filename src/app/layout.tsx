import { CalendarProvider } from '@/app/_context/CalendarContext';
import './globals.css';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ja">
      <body>
        <CalendarProvider initialEvents={[]}>{children}</CalendarProvider>
      </body>
    </html>
  );
}
