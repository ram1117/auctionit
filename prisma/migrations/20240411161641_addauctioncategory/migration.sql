/*
  Warnings:

  - Added the required column `auction_categoryId` to the `auction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auction" ADD COLUMN     "auction_categoryId" INTEGER NOT NULL,
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- CreateTable
CREATE TABLE "auction_category" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "auction_category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_auction_categoryId_fkey" FOREIGN KEY ("auction_categoryId") REFERENCES "auction_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
