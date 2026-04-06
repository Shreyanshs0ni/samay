import 'dotenv/config';
import { prisma } from '@/lib/prisma';

async function main() {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log('DB Connected ✅', result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
