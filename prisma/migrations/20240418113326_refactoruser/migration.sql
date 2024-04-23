/*
  Warnings:

  - You are about to drop the column `creater_id` on the `auction` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `winning_bid_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `user_` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "auction" DROP CONSTRAINT "auction_creater_id_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_winning_bid_id_fkey";

-- DropIndex
DROP INDEX "item_winning_bid_id_key";

-- AlterTable
ALTER TABLE "auction" DROP COLUMN "creater_id",
ADD COLUMN     "user_Id" TEXT,
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '48 hours';

-- AlterTable
ALTER TABLE "bid" ADD COLUMN     "itemId" TEXT;

-- AlterTable
ALTER TABLE "item" DROP COLUMN "isApproved",
DROP COLUMN "owner_id",
DROP COLUMN "winning_bid_id",
ADD COLUMN     "winner_id" TEXT;

-- AlterTable
ALTER TABLE "user_" DROP COLUMN "isVerified";

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "user_"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "user_"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
