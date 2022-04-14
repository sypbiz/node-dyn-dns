import * as Config from "config";
import { IConfig } from "./interfaces/config";
export type { IConfig, IHostConfig } from "./interfaces/config";

export const CONFIG: IConfig = Config.util.toObject();
export default CONFIG;