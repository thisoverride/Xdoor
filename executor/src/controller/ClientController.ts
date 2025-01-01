import { inject, injectable } from 'inversify';
import type { Socket } from 'socket.io-client';
import { OnConnect, OnDisconnect, Channel } from '../framework/express/hotspring/annotations/methods/httpMethode';
import ExecService from '../service/ExecService';

@injectable()
export default class ClientController {
  private readonly _execService: ExecService;

  constructor(@inject(ExecService) execService: ExecService) {
    this._execService = execService;
  }

  @OnConnect()
  public async handleConnect(socket: Socket) {
    console.log('connected to server')
    const metas = await this._execService.getMeta();
    socket.emit('system:register', metas);
    console.log('metas', metas)

    // Relier les données du terminal au client lorsque le terminal est lancé
    // this._execService.runTerm((data) => {
    //   socket.emit('term:output', data);
    // });
  }

  @Channel('exec:term')
  public handleTerm(socket: Socket, data: any): void {
    // Lancer le terminal à la demande
    try {
      console.log('ici') 
      this._execService.runTerm((data) => {
        socket.emit('term:output', data);
      });
      socket.emit('term:ready', 'Terminal prêt à recevoir des commandes');
    } catch (error) {
      socket.emit('term:error', error);
    }
  }

  @Channel('term:input')
  public handleTermInput(socket: Socket, command: string): void {
    try {
      this._execService.execCommand(command);
    } catch (error) {
      socket.emit('term:error', error);
    }
  }

  @Channel('term:resize')
  public handleTermResize(socket: Socket, { cols, rows }: { cols: number, rows: number }): void {
    try {
      this._execService.resizeTerminal(cols, rows);
      socket.emit('term:resize:success', { cols, rows });
    } catch (error) {
      socket.emit('term:resize:error', error);
    }
  }

  // @OnDisconnect()
  // public handleDisconnect() {
  //   // this._execService.close(); 
  // }
}
