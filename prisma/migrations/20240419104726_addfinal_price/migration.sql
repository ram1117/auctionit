-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '48 hours';

-- AlterTable
ALTER TABLE "item" ADD COLUMN     "final_price" DECIMAL(65,30);
