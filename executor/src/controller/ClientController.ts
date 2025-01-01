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
    const metas = this._execService.getMeta();
    socket.emit('system:register', metas);
    const al = await this._execService.runTerm()

    console.log(al)
  }

  @Channel('exec:term')
  public handleTerm(socket: Socket, data: any): void {
    // console.log(data)
    // this._execService.execute()
  }
}
 