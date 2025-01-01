import { inject, injectable } from 'inversify';
import { Socket } from 'socket.io';
import { OnConnect, OnDisconnect, Channel } from '../framework/express/hotspring/annotations/methods/httpMethode';
import ClientManagerService from '../service/ClientManagerService';

@injectable()
export default class BridgeController {
  private readonly _clientManagerService: ClientManagerService;

  constructor(@inject(ClientManagerService) clientManagerService: ClientManagerService) { 
    this._clientManagerService = clientManagerService;
  }

  @OnConnect()
  public async clientConnected(socket: Socket): Promise<void> {
    await this._clientManagerService.setClient(socket.id, socket); 
    socket.emit('connected', { message: `Bienvenue ${socket.id}` });
  }

  @OnDisconnect()
  public async clientDisconnected(socket: Socket): Promise<void> {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
    await this._clientManagerService.removeClient(socket.id); 
  }

  @Channel('system:register')
  public async handleRegisterClient(socket: Socket, data: any): Promise<void> {
    if(ClientManagerService.TYPE_CLIENT.EXEC === data.type){
      await this._clientManagerService.setClient(socket.id, socket, data);
      console.log('executor added')
    } else if(ClientManagerService.TYPE_CLIENT.SENDER === data.type){
      console.log('client added' , socket.id)
    }
  }

  @Channel('system:computer-listing')
  public async handleComputerList(socket: Socket, data: any): Promise<void> {
    const executorInfo = this._clientManagerService.getAllExecutor();
    socket.emit('system:computer-listing', executorInfo)
  }

  @Channel('exec:command')
  public async handleExecCommand(socket: Socket, data: { to: string; message: string }): Promise<void> {
    const targetClient = await this._clientManagerService.getClient(data.to);
    if (targetClient) {
      targetClient.socket.emit('command', data.message);  
    } else {
      socket.emit('error', { message: 'Client non trouvé' });
    }
  }
}
