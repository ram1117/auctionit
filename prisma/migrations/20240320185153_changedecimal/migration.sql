/*
  Warnings:

  - You are about to alter the column `price` on the `bid` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `starting_price` on the `item` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "bid" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "item" ALTER COLUMN "starting_price" SET DATA TYPE DOUBLE PRECISION;
