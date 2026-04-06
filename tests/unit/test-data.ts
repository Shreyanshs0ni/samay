import { prisma } from '@/lib/prisma';

async function main() {
  const data = await prisma.user.findMany({
    include: {
      tasks: true,
      sessions: true,
    },
  });

  console.log(JSON.stringify(data, null, 2));
}

main();
