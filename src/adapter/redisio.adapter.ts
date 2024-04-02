import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  constructor(
    app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: this.configService.get('REDIS_URL'),
    });
    const subClient = pubClient.duplicate();

    // await pubClient.connect();
    // await subClient.connect();

    pubClient.on('error', (error) => {
      console.log('redis connection failed: ', error);
    });
    subClient.on('error', (error) => {
      console.log('redis connection failed: ', error);
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);

    const webSocketConfig = this.configService.get<any>('webSocket');
    const timeout: number =
      webSocketConfig?.websocketHearthbeatTimeout || 30000;
    setInterval(() => {
      const clients: Map<string, Socket> = server.sockets.sockets;
      Object.keys(clients).forEach((socketId) => {
        const socket: Socket = clients[socketId] as Socket;
        if (socket.connected) {
          socket.send('ping');
        }
      });
    }, timeout);

    server.on('connection', (socket) => {
      socket.on('message', (message: string) => {
        if (message === 'pong') {
          const pingTimeout = socket['pingTimeout'] as { refresh: () => void };
          pingTimeout.refresh();
        }
      });
    });

    return server;
  }
}
