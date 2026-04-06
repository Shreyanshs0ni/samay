import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();

  console.log('🔥 Webhook received:', body);

  const eventType = body.type;

  if (eventType === 'user.created') {
    const user = body.data;

    console.log('✅ Creating user:', user.id);

    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.email_addresses[0]?.email_address,
        name: user.first_name,
      },
    });
  }

  return new Response('OK', { status: 202 });
}
