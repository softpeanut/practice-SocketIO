import {
    ConnectedSocket, MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit, SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';
import {Logger} from "@nestjs/common";

@WebSocketGateway({namespace: 'chats'})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('chats');

    @SubscribeMessage('messages')
    handleMessage(@MessageBody() data: string,
                  @ConnectedSocket() client: Socket,) {
        this.logger.log('handle message');
        this.server.emit('messages', {
            data,
            client: client.id,
        });
    }

    afterInit(server: Server) {
        this.logger.log('init');
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.logger.log(`disconnected : ${socket.id} ${socket.nsp.name}`);
    }

}