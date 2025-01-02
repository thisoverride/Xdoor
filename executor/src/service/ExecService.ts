import { injectable } from "inversify";
import os from 'os';
import { type IPty, spawn } from "node-pty";
import axios from 'axios';
import si from 'systeminformation';
import screenshot from 'screenshot-desktop';

interface SystemMetadata {
  type: string;
  hostname: string;
  username: string
  ip: string;
  id?: string;
}

interface TerminalOptions {
  cols?: number;
  rows?: number;
  name?: string;
}

@injectable()
export default class ExecService {
  private static readonly DEFAULT_TERMINAL_OPTIONS: TerminalOptions = {
    name: 'xterm-color',
    cols: 80,
    rows: 24
  };

  private static readonly EXECUTOR_TYPE = 'X-EXECUTOR';
  private static readonly IP_API_URL: string = process.env.API || '';
  private readonly SHELL = this.determineShell();
  private term: IPty | null = null;

  private determineShell(): string {
    switch (os.platform()) {
      case 'darwin':
        return '/bin/zsh';
      case 'win32':
        return 'powershell.exe';
      default:
        return 'bash';
    }
  }

  public async takeScreenshot(): Promise<string> {
    try {
      const img = await screenshot({ format: 'png' });
      return `data:image/png;base64,${img.toString('base64')}`;
    } catch (error) {
      console.error('Erreur lors de la capture de l\'écran :', error);
      throw new Error('Impossible de capturer l\'écran');
    }
  }

  private async getMotherboardSerial(): Promise<string | undefined> {
    try {
      const data = await si.system();
      return data.serial;
    } catch (error) {
      console.error('Failed to retrieve system information:', error);
      return undefined;
    }
  }

  private async getPublicIP(): Promise<string> {
    try {
      const response = await axios.get<{ ip: string }>(ExecService.IP_API_URL);
      return response.data.ip;
    } catch (error) {
      console.error('Failed to fetch public IP:', error);
      return 'Unable to retrieve IP';
    }
  }

  public async getMeta(): Promise<SystemMetadata> {
    const [ip, id] = await Promise.all([
      this.getPublicIP(),
      this.getMotherboardSerial()
    ]);

    return {
      type: ExecService.EXECUTOR_TYPE,
      hostname: os.hostname(),
      username: os.userInfo().username,
      ip,
      ...(id && { id })
    };
  }

  private createTerm(options?: TerminalOptions): void {
    if (this.term) return;

    const termOptions = {
      ...ExecService.DEFAULT_TERMINAL_OPTIONS,
      ...options,
      cwd: os.homedir(),
      env: process.env
    };

    this.term = spawn(this.SHELL, [], termOptions);
  }

  public runTerm(onDataCallback: (data: string) => void, options?: TerminalOptions): void {
    try {
      this.createTerm(options);
      this.term?.onData(onDataCallback);
    } catch (error) {
      console.error('Failed to initialize terminal:', error);
      throw new Error('Terminal initialization failed');
    }
  }

  public execCommand(command: string): void {
    if (!this.term) {
      throw new Error("Terminal is not initialized. Please call runTerm first.");
    }
    
    try {
      this.term.write(`${command}\r`);
    } catch (error) {
      console.error('Failed to execute command:', error);
      throw new Error('Command execution failed');
    }
  }

  public resizeTerminal(cols: number, rows: number): void {
    if (!this.term) {
      throw new Error("Terminal is not initialized. Please call runTerm first.");
    }

    try {
      this.term.resize(cols, rows);
    } catch (error) {
      console.error('Failed to resize terminal:', error);
      throw new Error('Terminal resize failed');
    }
  }

  public close(): void {
    try {
      if (this.term) {
        this.term.kill();
        this.term = null;
      }
    } catch (error) {
      console.error('Failed to close terminal:', error);
      throw new Error('Terminal close failed');
    }
  }
}