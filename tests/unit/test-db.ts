import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log('DB Connected ✅', result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
