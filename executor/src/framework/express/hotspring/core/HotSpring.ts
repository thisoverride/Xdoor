import 'reflect-metadata';
import { Container } from 'inversify';
import { io, Socket } from 'socket.io-client';

interface WsEventMetadata {
  event: string;
  handler: Function;
}

export default class HotSpring {
  public static bind(ioContainer: Container, ControllerClass: any, io?: Socket): void {
    const controllerInstance = ioContainer.get(ControllerClass);

    if (io) {
      const wsEvents: WsEventMetadata[] = Reflect.getMetadata('wsEvents', ControllerClass);

      if(wsEvents === undefined){
        throw new Error('Binding failled channel')
      }

      wsEvents.forEach((socketMeta) => {
        const handler = socketMeta.handler.bind(controllerInstance);
        if (socketMeta.event === 'connect') {
          io.on(socketMeta.event, () => handler(io));
        }else {
          io.on(socketMeta.event, (data?: any) => handler(io, data));
        }
      })
    }
  } 
}