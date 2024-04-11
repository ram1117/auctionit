/*
  Warnings:

  - You are about to drop the column `active` on the `notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "active",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notificationEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
