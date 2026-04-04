/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add column as nullable
ALTER TABLE "User" ADD COLUMN "clerkId" TEXT;

-- Step 2: Fill existing row
UPDATE "User" SET "clerkId" = 'manual-temp-id';

-- Step 3: Make it NOT NULL
ALTER TABLE "User" ALTER COLUMN "clerkId" SET NOT NULL;