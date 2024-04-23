/*
  Warnings:

  - You are about to drop the column `itemId` on the `bid` table. All the data in the column will be lost.
  - You are about to drop the column `not_for_same` on the `item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[win_bid_id]` on the table `item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "bid" DROP CONSTRAINT "bid_itemId_fkey";

-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '48 hours';

-- AlterTable
ALTER TABLE "bid" DROP COLUMN "itemId";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "not_for_same",
ADD COLUMN     "not_for_sale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "win_bid_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "item_win_bid_id_key" ON "item"("win_bid_id");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_win_bid_id_fkey" FOREIGN KEY ("win_bid_id") REFERENCES "bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;
