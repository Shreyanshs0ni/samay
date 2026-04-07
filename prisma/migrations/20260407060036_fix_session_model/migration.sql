/*
  Warnings:

  - You are about to drop the column `status` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "status",
ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "endTime" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Session_workspaceId_endTime_idx" ON "Session"("workspaceId", "endTime");
