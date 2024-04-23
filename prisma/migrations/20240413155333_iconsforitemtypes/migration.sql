-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "auction_category" ADD COLUMN     "iconUrl" TEXT;

-- AlterTable
ALTER TABLE "item_type" ADD COLUMN     "iconUrl" TEXT;
