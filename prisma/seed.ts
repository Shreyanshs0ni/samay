import { prisma } from '@/lib/prisma';

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Shrey',
    },
  });

  const task = await prisma.task.create({
    data: {
      title: 'Build SAMAY app',
      userId: user.id,
    },
  });

  await prisma.session.create({
    data: {
      title: 'Deep Work',
      type: 'FOCUS',
      startTime: new Date(),
      endTime: new Date(Date.now() + 25 * 60000),
      duration: 25,
      userId: user.id,
      taskId: task.id,
    },
  });

  console.log('Seeded 🌱');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
