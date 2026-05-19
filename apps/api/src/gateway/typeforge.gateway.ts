import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { CompilerService } from '../compiler/compiler.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
    credentials: true,
  },
  namespace: '/typeforge',
})
export class TypeForgeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(TypeForgeGateway.name);

  constructor(
    private compiler: CompilerService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ??
        (client.handshake.headers?.authorization as string)?.replace(
          'Bearer ',
          '',
        );

      if (!token) throw new UnauthorizedException('No token provided');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET', 'fallback-secret'),
      });

      client.data.userId = payload.sub;
      client.join(`user:${payload.sub}`);
      client.emit('connected', { id: client.id });
    } catch {
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('compile')
  handleCompile(
    @MessageBody() data: { code: string; strict?: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.userId) return;
    const result = this.compiler.compile(data.code, data.strict ?? true);
    client.emit('compile:result', result);
  }

  @SubscribeMessage('playground:join')
  handleJoinPlayground(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data.userId) return;
    client.join(`playground:${data.roomId}`);
    client.emit('playground:joined', { roomId: data.roomId });
  }

  broadcastXpGained(userId: string, xp: number, newTotal: number) {
    this.server.to(`user:${userId}`).emit('xp:gained', { xp, newTotal });
  }
}
