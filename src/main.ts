import "./extensions";
import { networkInterfaces } from "os";
import { CONFIG, IHostConfig } from "./config";
import Axios from "axios";
import { EventLogger } from "node-windows";

const logger = new EventLogger({ source: "NodeDynDns" });
// const logger = { info: console.log, error: console.error };

function getIp(interfaceName: string | null) {
  if (!interfaceName) {
    // public
    return null;
  } else {
    // private
    const interfaceInfo = Object.entries(networkInterfaces())
      .filter(([name]) => name === interfaceName)
      .flatMap(([_, i]) => i!)
      .find(i => i.internal === false && i.family === "IPv4");
    if (!interfaceInfo) {
      throw new Error(`Interface ${interfaceName} not found`);
    }
    return interfaceInfo.address;
  }
}

function getUrl(config: IHostConfig, ip: string | null) {
  // https://username:password@domains.google.com/nic/update?hostname=subdomain.yourdomain.com&myip=1.2.3.4
  const parts = [
    `https://${config.user}:${config.password}@domains.google.com/nic/update`,
    `?hostname=${config.hostname}`,
  ];
  if (ip) parts.push(`&myip=${ip}`);

  return parts.join("");
}

async function executeHost(host: IHostConfig): Promise<string> {
  const ip = getIp(host.interface);
  const url = getUrl(host, ip);
  logger.info(`Updating '${host.hostname} @ ${ip ?? "external"}'...`);
  const response = await Axios.post(url);
  if (response.status !== 200) {
    throw new Error(`Unexpected response status: ${response.status} ${response.statusText}`);
  }
  return response.data;
}

async function execute() {
  try {
    const promises = CONFIG.hosts.map(executeHost);
    const results = await Promise.allSettled(promises);
    const messages = results.map((result, i) => result.status === "fulfilled"
      ? `${i + 1}) ${result.value}`
      : `${i + 1}) ${result.reason.stack}`);
    logger.info(`Results:\r\n${messages.join("\r\n")}`);
  } catch (e) {
    debugger;
    logger.error(String(e));
  }
}

async function start() {
  do {
    await execute();
    await setTimeout.async(CONFIG.interval);
  } while (true);
}

start();