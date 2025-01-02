import { injectable } from "inversify";
import { json } from "sequelize";

interface Client {
  id: string | null;
  socket: any;
  hostInfo: Host;
}

interface Host {
  ip: string;
  hostname: string;
  type: string
}

@injectable()
export default class ClientManagerService {
  public static readonly TYPE_CLIENT = {
    EXEC : 'X-EXECUTOR',
    SENDER : 'X-SENDER'
  }
  private clients: Map<string, Client> = new Map(); 

  public async setClient(socketID: string, socket: any, hostInfo: any): Promise<void> {
    this.clients.set(socketID, { id : hostInfo ? hostInfo.id : null, socket, hostInfo}); 
  }

  public getClient(sockerID: string): Client | null {
    return this.clients.get(sockerID) ?? null;
  }

  public findById(id: string): string | null {
    for (const [key, value] of this.clients.entries()) {
      if (value.id === id) {
        return key;
      }
    }
    return null;
  }

  public getAllExecutor(): string[] {
    const result: string[] = []
    for (const [_key, client] of this.clients.entries()) {
      if(client.hostInfo.type === ClientManagerService.TYPE_CLIENT.EXEC){
        result.push(JSON.stringify(client.hostInfo));
      }
    }
    return result;
  }

  public async removeClient(id: string): Promise<void> {
      this.clients.delete(id);
      console.log(`Client supprimé: ${id}`);
  }
}
