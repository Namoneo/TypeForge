import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CompilerService } from '../compiler/compiler.service';

@WebSocketGateway({ cors: true, namespace: '/typeforge' })
export class TypeForgeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private compiler: CompilerService) {}

  handleConnection(client: Socket) {
    client.emit('connected', { id: client.id });
  }

  handleDisconnect(_client: Socket) {}

  @SubscribeMessage('compile')
  handleCompile(
    @MessageBody() data: { code: string; strict?: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.compiler.compile(data.code, data.strict ?? true);
    client.emit('compile:result', result);
  }

  @SubscribeMessage('playground:join')
  handleJoinPlayground(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`playground:${data.roomId}`);
    client.emit('playground:joined', { roomId: data.roomId });
  }

  broadcastXpGained(userId: string, xp: number, newTotal: number) {
    this.server.to(`user:${userId}`).emit('xp:gained', { xp, newTotal });
  }
}
