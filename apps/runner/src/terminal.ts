import { spawn, type IPty } from "node-pty";
import { platform } from "os";
interface ISession {
  terminal: IPty;
  labId: string;
}
export class TerminalManager {
  private sessions: Map<string, ISession>;
  private shell: string;
  private static _instance: TerminalManager;

  private constructor() {
    this.shell = platform() === "win32" ? "powershell.exe" : "bash";
    this.sessions = new Map();
  }

  public static getInstance() {
    if (this._instance) return this._instance;

    this._instance = new TerminalManager();
    return this._instance;
  }

  public createTermSession(
    sessionId: string,
    labId: string,
    onData: (data: string, id: number) => void
  ) {
    const termProcess = spawn(this.shell, [], {
      cols: 80,
      rows: 30,
      cwd: "/workspace",
      name: "xterm",
    });

    this.sessions.set(sessionId, {
      terminal: termProcess,
      labId,
    });

    termProcess.onData((data) => {
      if (data) {
        console.log("Data from terminal:", data);
        onData(data, termProcess.pid);
      } else {
        console.error("Received undefined data from terminal process");
      }
    });

    termProcess.onExit(() => this.sessions.delete(sessionId));

    return termProcess;
  }

  public writeData(sessionId: string, data: string) {
    const session = this.sessions.get(sessionId);

    if (!session) return;

    session?.terminal.write(data);
  }

  public clear(sessionId: string) {
    this.sessions.get(sessionId)?.terminal.kill();
  }
}
