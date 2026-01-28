export function getPrevMonth(year: number, month: number) {
  const d = new Date(year, month - 1, 1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function getNextMonth(year: number, month: number) {
  const d = new Date(year, month - 1, 1);
  d.setMonth(d.getMonth() + 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

export function getPrevDay(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export function getNextDay(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export function getPrevWeek(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 7);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}

export function getNextWeek(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 7);
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
}
