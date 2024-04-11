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

  async acceptPushNotification(userId: string, data: AcceptNotificationDto) {
    const token = await this.prisma.notification_token.findFirst({
      where: { notification_token: data.notification_token },
    });
    if (!token)
      return await this.prisma.notification_token.create({
        data: { ...data, user_id: userId },
      });
  }

  async subscribeTopic(userId: string, auction_id: string) {
    const tokens = (
      await this.prisma.notification_token.findMany({
        where: { user_id: userId },
      })
    ).map((token) => token.notification_token);

    this.subscribeService.createOrUpdate(userId, auction_id);
    return await firebase.messaging().subscribeToTopic(tokens, auction_id);
  }
  async unsubscribeTopic(userId: string, auction_id: string) {
    const tokens = (
      await this.prisma.notification_token.findMany({
        where: { user_id: userId },
      })
    ).map((token) => token.notification_token);

    this.subscribeService.update(userId, auction_id);
    return await firebase.messaging().unsubscribeFromTopic(tokens, auction_id);
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
