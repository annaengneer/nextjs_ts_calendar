import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 border-r bg-gray-100">
          <Sidebar />
        </aside>

        <div className="flex-1 p-4 overflow-hidden bg-gray-50">
          <div className="flex h-full flex-col rounded-xl bg-white  overflow-hidden">
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
