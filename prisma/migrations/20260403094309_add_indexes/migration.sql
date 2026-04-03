/*
  Warnings:

  - A unique constraint covering the columns `[habitId,date]` on the table `HabitLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HabitLog_habitId_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "Task_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");

-- CreateIndex
CREATE INDEX "Session_userId_startTime_idx" ON "Session"("userId", "startTime");

-- CreateIndex
CREATE INDEX "Task_userId_status_idx" ON "Task"("userId", "status");
