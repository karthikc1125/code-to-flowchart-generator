interface IElectronAPI {
  ipcRenderer: {
    invoke(channel: string, ...args: any[]): Promise<any>;
  };
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
} 