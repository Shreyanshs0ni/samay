import getCurrentUser from '@/lib/current-user';

export default async function page() {
  const user = await getCurrentUser();
  return <div>Hello {user?.name}</div>;
}
