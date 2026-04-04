import { auth } from '@clerk/nextjs/server';

export default async function page() {
  const { userId } = await auth();
  console.log(userId);
  return <div>Dashboard</div>;
}
