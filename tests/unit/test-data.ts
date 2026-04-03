import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
