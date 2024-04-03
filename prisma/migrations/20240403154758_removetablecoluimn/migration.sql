/*
  Warnings:

  - You are about to drop the column `current_value` on the `auction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auction" DROP COLUMN "current_value",
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';
