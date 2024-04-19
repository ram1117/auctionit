import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AcceptNotificationDto } from './dtos/acceptNotification.dto';
import * as firebase from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { SubscribeService } from '../subscribe/subscribe.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private subscribeService: SubscribeService,
  ) {
    const firebase_config = JSON.parse(
      this.configService.get('FIREBASE_CONFIG'),
    );
    firebase.initializeApp({
      credential: firebase.credential.cert(firebase_config),
    });
  }

  async findManyTokens(userId: string) {
    const tokens = await this.prisma.notification_token.findMany({
      where: { user_id: userId },
    });
    return tokens.map((token) => token.notification_token);
  }

  async addToken(userId: string, data: AcceptNotificationDto) {
    const token = await this.prisma.notification_token.findFirst({
      where: { notification_token: data.notification_token },
    });
    if (!token)
      return await this.prisma.notification_token.create({
        data: { ...data, user_id: userId },
      });

    return { message: 'token already exists' };
  }

  async subscribeTopic(userId: string, auction_id: string) {
    const tokens = (
      await this.prisma.notification_token.findMany({
        where: { user_id: userId },
      })
    ).map((token) => token.notification_token);

    this.subscribeService.createOrUpdate(userId, auction_id, {
      notificationEnabled: true,
    });

    if (tokens.length !== 0)
      await firebase.messaging().subscribeToTopic(tokens, auction_id);
    return { success: true, message: 'Subscribed' };
  }
  async unsubscribeTopic(userId: string, auction_id: string) {
    const tokens = (
      await this.prisma.notification_token.findMany({
        where: { user_id: userId },
      })
    ).map((token) => token.notification_token);

    this.subscribeService.createOrUpdate(userId, auction_id, {
      notificationEnabled: false,
    });
    if (tokens.length !== 0)
      await firebase.messaging().unsubscribeFromTopic(tokens, auction_id);
    return { success: true, message: 'Unsubscribed' };
  }

  async disablePushNotification(token_id: string) {
    return await this.prisma.notification_token.delete({
      where: { notification_token: token_id },
    });
  }

  async sendPush(auction_id: string, notificationData: any) {
    console.log('sending push message ', new Date());
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
