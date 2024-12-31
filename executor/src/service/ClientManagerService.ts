import { injectable } from "inversify";

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
  private clients: Map<string, Client> = new Map(); 

  public async setClient(id: string, socket: any, hostInfo?: any): Promise<void> {
    const client: Client = { id, socket, hostInfo};
    this.clients.set(id, client); 
    console.log(`Client ajouté: ${id}`);
  }

  public async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  public async removeClient(id: string): Promise<void> {
    this.clients.delete(id);
    console.log(`Client supprimé: ${id}`);
  }
}
