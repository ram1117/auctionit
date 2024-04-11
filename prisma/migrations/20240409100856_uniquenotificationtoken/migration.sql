/*
  Warnings:

  - A unique constraint covering the columns `[notification_token]` on the table `notification_token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- CreateIndex
CREATE UNIQUE INDEX "notification_token_notification_token_key" ON "notification_token"("notification_token");
