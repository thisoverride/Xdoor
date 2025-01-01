import { Container } from 'inversify';
import HotSpring from './hotspring/core/HotSpring';
import ClientController from '../../controller/ClientController';
import ClientManagerService from '../../service/ExecService'
import { io, Socket } from 'socket.io-client';

export default class ExpressApplication {
  private IoCContainer: Container;
  private socket: Socket;

  constructor() {
    this.IoCContainer = new Container();
    this.socket = io(process.env.URI);
    this.IoCContainer.bind<ClientController>(ClientController).toSelf();
    this.IoCContainer.bind<ClientManagerService>(ClientManagerService).toSelf();
    HotSpring.bind(this.IoCContainer, ClientController, this.socket);
  }
}
