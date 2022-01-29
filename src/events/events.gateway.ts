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

@WebSocketGateway(81, {namespace: 'chat'})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private logger: Logger = new Logger('Gateway');

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
        this.logger.log('handle event');
        return data;
    }

    @SubscribeMessage('messages')
    handleMessage(client: Socket, data: any): void {
        this.logger.log('handle message');
        client.emit('message', data);
    }

    afterInit(server: Server): any {
        this.logger.log('init');
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log('connected', socket.nsp.name);
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        this.logger.log('disconnected', socket.nsp.name);
    }

}