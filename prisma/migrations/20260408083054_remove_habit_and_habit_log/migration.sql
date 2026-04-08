/*
  Warnings:

  - You are about to drop the `Habit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HabitLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- DropForeignKey
ALTER TABLE "HabitLog" DROP CONSTRAINT "HabitLog_habitId_fkey";

-- DropTable
DROP TABLE "Habit";

-- DropTable
DROP TABLE "HabitLog";
