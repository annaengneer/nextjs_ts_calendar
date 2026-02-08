export function formatMonthTitle(year: number, month: number) {
  return `${year}年${month}月`;
}

export function formatDayTitle(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  const week = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${year}年${month}月${day}日（${week}）`;
}

export function formatWeekTitle(year: number, month: number, day: number) {
  const start = new Date(year, month - 1, day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.getFullYear()}年${
    start.getMonth() + 1
  }月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
}
