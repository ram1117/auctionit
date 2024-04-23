/*
  Warnings:

  - You are about to drop the column `user_Id` on the `auction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "auction" DROP CONSTRAINT "auction_user_Id_fkey";

-- AlterTable
ALTER TABLE "auction" DROP COLUMN "user_Id",
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '48 hours';
