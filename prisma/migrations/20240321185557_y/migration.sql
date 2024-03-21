/*
  Warnings:

  - Added the required column `bidder_id` to the `bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "current_value" SET DEFAULT 0.00,
ALTER COLUMN "start_value" SET DEFAULT 0.00;

-- AlterTable
ALTER TABLE "bid" ADD COLUMN     "bidder_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "user_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
