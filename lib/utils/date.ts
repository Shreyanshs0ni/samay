export function dayStart(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function dayEnd(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPrevDate(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return toLocalIsoDate(d);
}

export function getNextDate(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return toLocalIsoDate(d);
}
