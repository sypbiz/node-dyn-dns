import { IConfig } from "../src/interfaces/config";

export default {
    interval: 1 * 5 * 1000,
    hosts: [
        {
            user: "username",
            password: "password",
            hostname: "internal.bar.com",
            interface: "Wi-Fi"
        },
        {
            user: "username",
            password: "password",
            hostname: "external.bar.com",
            interface: null
        }
    ]
} as IConfig;