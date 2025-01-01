import express, { Application } from 'express';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { Container } from 'inversify';
import HotSpring from './hotspring/core/HotSpring';

import { configureMiddleware } from './config/middleware';
import { configureErrorHandling } from './config/errorHandling';
import BridgeController from '../../controller/BridgeController';
import ClientManagerService from '../../service/ClientManagerService'
// import { UserRepository } from '../../repositories/UserRepository';

export default class ExpressApplication {
  private app: Application;
  private server: HttpServer;
  private io: SocketIOServer;
  private IoCContainer: Container;

  constructor() {
    this.app = express();
    this.IoCContainer = new Container();
    this.server = new HttpServer(this.app); 
    this.io = new SocketIOServer(this.server, {
      path: '/socket.io',
      cors: {
          origin: '*', // Autoriser toutes les origines
          methods: ['GET', 'POST'],
          // allowedHeaders: ['Content-Type'],
          credentials: true // Si vous utilisez des cookies, cela peut être nécessaire
      }
  });  
    this._initializeIoCContainer()
    this._configureApp();
  }

  private _initializeIoCContainer(): void {
    this.IoCContainer.bind<BridgeController>(BridgeController).toSelf();
    this.IoCContainer.bind<ClientManagerService>(ClientManagerService).toSelf();
  }

  
  private _configureApp(): void {
    // configureMiddleware(this.app);

    HotSpring.bind(this.app, this.IoCContainer, BridgeController, this.io);
    configureErrorHandling(this.app);
  }

  

  public async run(port: number): Promise<void> {
    this.server.listen(port, async () => {
      console.info('\x1b[1m\x1b[36m%s\x1b[0m', `Service live communication en cours d\'exécution sur http://localhost:${port}`);
    });
  }
}
