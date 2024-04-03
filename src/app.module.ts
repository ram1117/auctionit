import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { ItemModule } from './item/item.module';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import PrismaExceptionFilter from './filters/PrismaException.filter';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    PrismaModule,
    ItemModule,
    AuctionModule,
    BidModule,
    SubscribeModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
