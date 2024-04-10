import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcceptNotificationDto } from './dtos/acceptNotification.dto';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const firebase_config = JSON.parse(
      this.configService.get('FIREBASE_CONFIG'),
    );
    firebase.initializeApp({
      credential: firebase.credential.cert(firebase_config),
    });
  }

  async acceptPushNotification(userId: string, data: AcceptNotificationDto) {
    const token = await this.prisma.notification_token.findFirst({
      where: { user_id: userId },
    });
    if (!token) {
      return await this.prisma.notification_token.create({
        data: { ...data, user_id: userId },
      });
    }
    return await this.prisma.notification_token.update({
      where: { id: token.id },
      data: { notification_token: data.notification_token },
    });
  }

  async subscribeTopic(userId: string, auction_id: string) {
    const tokens = (
      await this.prisma.notification_token.findMany({
        where: { user_id: userId },
      })
    ).map((token) => token.notification_token);

    console.log(tokens);

    return await firebase.messaging().subscribeToTopic(tokens, auction_id);
  }
  async unsubscribeTopic(userId: string, auction_id: string) {
    const tokens = (
      await this.prisma.notification_token.findMany({
        where: { user_id: userId },
      })
    ).map((token) => token.notification_token);

    return await firebase.messaging().unsubscribeFromTopic(tokens, auction_id);
  }

  async disablePushNotification(token_id: string) {
    return await this.prisma.notification_token.update({
      where: { notification_token: token_id },
      data: { active: false },
    });
  }

  async getNotifications() {
    const auctionId = '2777781a-d8c8-4e27-936e-ca681ca3bd0f';
    console.log('sending push message ', new Date());
    const data = {
      title: 'New Bid Alert',
      message: 'for',
      href: `/auction/2777781a-d8c8-4e27-936e-ca681ca3bd0f`,
    };
    this.sendPush(auctionId, data);
  }

  async sendPush(auction_id: string, notificationData: any) {
    await firebase
      .messaging()
      .send({
        data: notificationData,
        topic: auction_id,
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}
