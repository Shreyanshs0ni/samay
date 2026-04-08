/*
  Warnings:

  - You are about to drop the column `taskId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";

-- DropIndex
DROP INDEX "Session_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "taskId",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Task";

-- DropEnum
DROP TYPE "TaskStatus";

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
