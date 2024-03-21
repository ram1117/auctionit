/*
  Warnings:

  - You are about to drop the column `created_by` on the `auction` table. All the data in the column will be lost.
  - You are about to drop the column `starting_price` on the `item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[winning_bid_id]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creater_id` to the `auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_value` to the `auction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "auction" DROP CONSTRAINT "auction_created_by_fkey";

-- AlterTable
ALTER TABLE "auction" DROP COLUMN "created_by",
ADD COLUMN     "creater_id" TEXT NOT NULL,
ADD COLUMN     "current_value" DOUBLE PRECISION,
ADD COLUMN     "start_value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "item" DROP COLUMN "starting_price",
ADD COLUMN     "winning_bid_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "item_winning_bid_id_key" ON "item"("winning_bid_id");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_winning_bid_id_fkey" FOREIGN KEY ("winning_bid_id") REFERENCES "bid"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_creater_id_fkey" FOREIGN KEY ("creater_id") REFERENCES "user_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
