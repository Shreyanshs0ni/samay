// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformSessionsToBlocks(sessions: any[]) {
  return sessions.map((session) => {
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);

    const startHour = start.getHours() + start.getMinutes() / 60;

    const endHour = end.getHours() + end.getMinutes() / 60;

    const duration = endHour - startHour;

    return {
      id: session.id,
      start: startHour,
      end: endHour,
      duration,
      category: session.category,
    };
  });
}
