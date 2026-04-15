/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "TimeBlock" ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "type" SET DEFAULT 'tracked';

-- DropTable
DROP TABLE "Session";

-- DropEnum
DROP TYPE "SessionType";
