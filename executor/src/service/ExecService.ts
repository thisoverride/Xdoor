import { injectable } from "inversify";
import os from 'os';
import { type IPty, spawn } from "node-pty";
import axios from 'axios';
import si from 'systeminformation';

@injectable()
export default class ExecService {
  private readonly SHELL = os.platform() === 'darwin' ? '/bin/zsh' : (os.platform() === 'win32' ? 'powershell.exe' : 'bash');
  private term: IPty | null = null;

  private async getMotherboardSerial() {
    try {
      const data = await si.system(); 
      return data.serial;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations système:', error);
    }
  };

  public async getMeta() {
    try {
      const response = await axios.get('https://api.ipify.org/?format=json');
      return {
        type: 'X-EXECUTOR',
        hostname: os.hostname(),
        ip: response.data.ip,
        id: await this.getMotherboardSerial(),
      };
    } catch (error) {
      console.error('Error fetching public IP:', error);
      return {
        type: 'X-EXECUTOR',
        hostname: os.hostname(),
        ip: 'Unable to retrieve IP'
      };
    }
  }

  private createTerm(): void {
    if (!this.term) {
      this.term = spawn(this.SHELL, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: os.homedir(),
        env: process.env,
      });
    }
  }

  public runTerm(onDataCallback: (data: string) => void): void {
    this.createTerm();

    if (this.term) {
      this.term.onData(onDataCallback);
    }
  }

  public execCommand(command: string): void {
    if (this.term) {
      this.term.write(command + '\r'); // Ajout de '\r' pour simuler un retour à la ligne
    } else {
      throw new Error("Terminal is not initialized. Please call runTerm first.");
    }
  }

  public resizeTerminal(cols: number, rows: number): void {
    if (this.term) {
      this.term.resize(cols, rows); // Redimensionner le terminal
    } else {
      throw new Error("Terminal is not initialized. Please call runTerm first.");
    }
  }

  public close(): void {
    if (this.term) {
      this.term.kill(); // Fermer proprement le terminal
      this.term = null;
    }
  }
}
