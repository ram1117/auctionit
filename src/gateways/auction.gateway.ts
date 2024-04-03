import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BidService } from '../bid/bid.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuctionGateway {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private bidService: BidService) {}

  @SubscribeMessage('place-bid-join')
  async joinRoom(client: Socket, roomId: string): Promise<void> {
    await client.join(roomId);
    const top_bid = await this.bidService.findOne(roomId);
    const payload = top_bid
      ? {
          value: top_bid.price,
          username: top_bid.bidder.username,
          time: top_bid.bid_time,
        }
      : { message: 'No bids placed yet' };

    this.server.to(roomId).emit('new_bid_placed', payload);
  }

  @SubscribeMessage('place-bid-leave')
  async leaveRoom(client: Socket, roomId: string): Promise<void> {
    await client.leave(roomId);
  }

  public placeBidInRoom(roomId: string, payload: any) {
    this.server.to(roomId).emit('new_bid_placed', payload);
  }
}
