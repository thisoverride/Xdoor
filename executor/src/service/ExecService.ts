import { injectable } from "inversify";
import os from 'os';
import { type IPty, spawn } from "node-pty";

@injectable()
export default class ExecService {
  private readonly SHELL = os.platform() === 'darwin' ? '/bin/zsh' : (os.platform() === 'win32' ? 'powershell.exe' : 'bash');
  private term: IPty | null = null;

  public getMeta() {
    return {
      type: 'X-EXECUTOR',
      hostname: os.hostname(),
      ip: "80.10.223.54"
    };
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
