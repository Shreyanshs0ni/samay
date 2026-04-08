export function getPrevDate(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString();
}

export function getNextDate(date: string) {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString();
}
