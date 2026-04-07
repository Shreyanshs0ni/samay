/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_userId_fkey";

-- DropIndex
DROP INDEX "Session_workspaceId_endTime_idx";

-- DropIndex
DROP INDEX "Session_workspaceId_startTime_idx";

-- DropIndex
DROP INDEX "Task_workspaceId_status_idx";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "workspaceId";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "workspaceId";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "workspaceId";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "workspaceId";

-- DropTable
DROP TABLE "Workspace";

-- CreateIndex
CREATE INDEX "Session_startTime_idx" ON "Session"("startTime");

-- CreateIndex
CREATE INDEX "Session_endTime_idx" ON "Session"("endTime");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");
