-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';
