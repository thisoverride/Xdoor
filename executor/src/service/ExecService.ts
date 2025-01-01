import { injectable } from "inversify";
import type { Socket } from "socket.io-client";
import os from 'os';
import { spawn } from "node-pty";

@injectable()
export default class ExecService {
  private termOutput: string = '';
  private readonly SHELL = os.platform() === 'darwin' ? '/bin/zsh' : (os.platform() === 'win32' ? 'powershell.exe' : 'bash')

  public getMeta() {
    return {
      type: 'X-EXECUTOR',
      hostname: os.hostname(),
    };
  }

  public runTerm(): Promise<string> {
    return new Promise((resolve, reject) => {
      const ptyProcess = spawn(this.SHELL, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: os.homedir(),
        env: process.env,
      });

      
      ptyProcess.onData((data) => {
        console.log(data)
        
      });

    });
  }
}
