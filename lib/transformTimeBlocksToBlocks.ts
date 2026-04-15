// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformTimeBlocksToBlocks(timeBlocks: any[]) {
  return timeBlocks.map((timeblock) => {
    const start = new Date(timeblock.startTime);
    const end = new Date(timeblock.endTime);

    const startHour = start.getHours() + start.getMinutes() / 60;

    const endHour = end.getHours() + end.getMinutes() / 60;

    const duration = endHour - startHour;

    return {
      id: timeblock.id,
      start: startHour,
      end: endHour,
      duration,
      category: timeblock.category,
    };
  });
}
