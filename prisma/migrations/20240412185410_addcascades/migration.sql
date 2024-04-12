-- DropForeignKey
ALTER TABLE "auction" DROP CONSTRAINT "auction_creater_id_fkey";

-- DropForeignKey
ALTER TABLE "auction" DROP CONSTRAINT "auction_item_id_fkey";

-- DropForeignKey
ALTER TABLE "bid" DROP CONSTRAINT "bid_auction_id_fkey";

-- DropForeignKey
ALTER TABLE "bid" DROP CONSTRAINT "bid_bidder_id_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_token" DROP CONSTRAINT "notification_token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_user_id_fkey";

-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_creater_id_fkey" FOREIGN KEY ("creater_id") REFERENCES "user_"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "user_"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_token" ADD CONSTRAINT "notification_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_"("id") ON DELETE CASCADE ON UPDATE CASCADE;
