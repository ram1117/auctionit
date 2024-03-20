-- CreateTable
CREATE TABLE "user_" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user__pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starting_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "isSold" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" TEXT NOT NULL,
    "item_type_id" INTEGER NOT NULL,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "item_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid" (
    "id" TEXT NOT NULL,
    "auction_id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "bid_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user__email_key" ON "user_"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user__username_key" ON "user_"("username");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auction" ADD CONSTRAINT "auction_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user_"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid" ADD CONSTRAINT "bid_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
