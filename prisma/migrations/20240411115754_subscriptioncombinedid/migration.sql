/*
  Warnings:

  - The primary key for the `subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("user_id", "auction_id");
