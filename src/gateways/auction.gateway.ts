import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuctionGateway {
  @WebSocketServer()
  private readonly server: Server;

  constructor() {}

  @SubscribeMessage('place-bid-join')
  async joinRoom(client: Socket, roomId: string): Promise<void> {
    await client.join(roomId);
  }

  @SubscribeMessage('place-bid-leave')
  async leaveRoom(client: Socket, roomId: string): Promise<void> {
    await client.leave(roomId);
  }

  public placeBidInRoom(roomId: string, payload: any) {
    this.server.to(roomId).emit('new_bid_placed', payload);
  }

  public postAuctionEnd(roomId: string, payload: any) {
    this.server.to(roomId).emit('auction_end', payload);
  }
}
