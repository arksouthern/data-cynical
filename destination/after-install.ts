import { argv0 } from "process"
import ProtocolRegistry from "protocol-registry"
import { DESTINATION_SETTINGS } from "../destination.settings"

const protocol = `ArkDestination${DESTINATION_SETTINGS.appScheme}`

async function register() {
    return ProtocolRegistry.register({
        protocol,
        override: await ProtocolRegistry.checkifExists(protocol),
        command: `
            cd "${__dirname}"; 
            ${argv0} launch.js
        `,
        script: true,
        terminal: true,
    })
}

async function afterInstall() {
    try { await register() } catch (error) {}
    try { await register() } catch (error) { console.error(error) }
    try {
        if (!await ProtocolRegistry.checkifExists(protocol))
            throw new Error("Unable to register for unknown reason.")
    } catch (error) {
        console.log(error)
    }
}

afterInstall()