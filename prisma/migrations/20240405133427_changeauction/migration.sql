-- AlterTable
ALTER TABLE "auction" ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';
