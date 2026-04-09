import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      clerkId: 'user_3C1i8GT3xITqAqWTb41FY5ymOm3',
    },
  });

  console.log('SEED USER:', user.id);

  if (!user) {
    console.log('❌ No user found');
    return;
  }

  // 🧹 Clean old sessions (optional)
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  // 🧩 Get categories
  let categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  if (categories.length === 0) {
    console.log('⚡ Creating default categories...');

    categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Study',
          color: '#3b82f6',
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Coding',
          color: '#10b981',
          userId: user.id,
        },
      }),
      prisma.category.create({
        data: {
          name: 'Gym',
          color: '#ef4444',
          userId: user.id,
        },
      }),
    ]);
  }

  if (categories.length === 0) {
    console.log('❌ No categories found');
    return;
  }

  const today = new Date();
  today.setDate(today.getDate() - 1);

  function createTime(hour: number, minute = 0) {
    const d = new Date(today);
    d.setHours(hour, minute, 0, 0);
    return d;
  }

  // 🧪 Sample sessions
  const sampleSessions = [
    {
      categoryId: categories[0].id,
      startTime: createTime(9, 0),
      endTime: createTime(10, 30),
    },
    {
      categoryId: categories[1 % categories.length].id,
      startTime: createTime(11, 0),
      endTime: createTime(12, 15),
    },
    {
      categoryId: categories[2 % categories.length].id,
      startTime: createTime(14, 0),
      endTime: createTime(16, 0),
    },
    {
      categoryId: categories[0].id,
      startTime: createTime(18, 30),
      endTime: createTime(19, 30),
    },
  ];

  for (const s of sampleSessions) {
    const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000;

    await prisma.session.create({
      data: {
        userId: user.id,
        categoryId: s.categoryId,
        startTime: s.startTime,
        endTime: s.endTime,
        duration,
      },
    });
  }

  console.log('✅ Seeded timeline data');
}

main().finally(() => prisma.$disconnect());
