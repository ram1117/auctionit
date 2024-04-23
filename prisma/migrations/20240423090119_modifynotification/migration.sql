/*
  Warnings:

  - You are about to drop the column `notification_tokenId` on the `notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_notification_tokenId_fkey";

-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '48 hours';

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "notification_tokenId";
