-- AlterTable
ALTER TABLE "auction" ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '48 hours';

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "not_for_same" BOOLEAN NOT NULL DEFAULT false;
