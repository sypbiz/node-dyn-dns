import { Service } from "node-windows";
import * as Path from "path";

async function install(svc: Service) {
    return new Promise<void>(async (resolve, reject) => {
        console.log("install");

        try {
            if (svc.exists) {
                console.log("install.already-installed");
                await uninstall(svc);
            }

            svc.once("install", () => {
                try {
                    console.log("install.on-install");
                    svc.start();
                } catch (e) {
                    debugger;
                    reject(e);
                }
            });

            svc.once("start", () => {
                console.log("install.on-start");
                resolve();
            });

            svc.install();
        } catch (e) {
            debugger;
            reject(e);
        }
    });
}

async function uninstall(svc: Service) {
    return new Promise<void>((resolve, reject) => {
        console.log("uninstall");

        if (!svc.exists) {
            console.log("uninstall.already-uninstalled");
            return resolve();
        }

        try {
            svc.on("uninstall", () => {
                console.log("uninstall.on-uninstall");
                resolve();
            });
            svc.uninstall();
        } catch (e) {
            debugger;
            reject(e);
        }
    });
}


async function main() {
    try {
        // Create a new service object
        const svc = new Service({
            name: "NodeDynDns",
            description: "Node.js Dynamic DNS Service",
            script: Path.join(__dirname, "main.js"),
            // nodeOptions: "--harmony --max_old_space_size=4096",
            env: {
                name: "NODE_ENV",
                value: "production"
            }
        });

        let [option] = process.argv.slice(2);
        option ??= "install";

        switch (option) {
            case "install":
                return await install(svc);
            case "uninstall":
                return await uninstall(svc);
            default: throw new Error(`Unknown option: ${option}`);
        }
    } catch (err) {
        debugger;
        console.log(err);
    }
}

main();