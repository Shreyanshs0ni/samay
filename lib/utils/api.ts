export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json(data, init);
}
