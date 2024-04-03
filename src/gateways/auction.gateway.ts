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
    console.log(client.id);
    this.server.to(roomId).emit('place_bid_join', {
      value: top_bid.price,
      username: top_bid.bidder.username,
    });
  }

  @SubscribeMessage('place-bid-leave')
  async leaveRoom(client: Socket, roomId: string): Promise<void> {
    await client.leave(roomId);
  }

  public placeBidInRoom(roomId: string, payload: any) {
    this.server.to(roomId).emit('new_bid_placed', payload);
  }
}
