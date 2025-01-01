import { injectable } from "inversify";
import { json } from "sequelize";

interface Client {
  id: string;
  socket: any;
  hostInfo: Host
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

  public async setClient(id: string, socket: any, hostInfo?: any): Promise<void> {
    const client: Client = { id, socket, hostInfo};
    this.clients.set(id, client); 
  }

  public async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  public getAllExecutor() {
    const result = []
    for (const [_key, client] of this.clients.entries()) {
      if(client.hostInfo){
        result.push(JSON.stringify(client.hostInfo))
      }
    }
    return result;
  }

  public async removeClient(id: string): Promise<void> {
    this.clients.delete(id);
    console.log(`Client supprimé: ${id}`);
  }
}
