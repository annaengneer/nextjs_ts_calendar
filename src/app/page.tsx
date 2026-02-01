import { redirect } from 'next/navigation';

export default function HomePage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  redirect(`/month/${year}/${month}`);
}
