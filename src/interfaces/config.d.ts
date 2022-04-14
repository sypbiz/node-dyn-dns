export interface IHostConfig {
  user: string;
  password: string;
  hostname: string;
  interface: string | null;
}

export interface IConfig {
  interval: number;
  hosts: IHostConfig[];
}