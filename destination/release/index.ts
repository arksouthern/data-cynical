import * as APIs from "../../backend/api/v1"
import { fastify } from "fastify"
import cors from '@fastify/cors'
import OU from "openurl"
import { autoCleanupReducer, autoUpdateReducer } from "./update"
import { DESTINATION_SETTINGS } from "../../destination.settings"

start().catch(console.log)

async function start() {

    process.on('SIGINT', async () => {
        try {
            await server.close();
            console.log('Server gracefully shut down');
            process.exit(0);
        } catch (err) {
            console.error('Error while shutting down server:', err);
            process.exit(1);
        }
    });

    await autoCleanupReducer()
    
    const server = fastify({ logger: false })

    server.register(cors, {origin: true})
    
    for (const route in APIs) // @ts-ignore
        if(typeof APIs[route] == "function") // @ts-ignore
            server.post(`/api/v1/${route}`, (req, res) => // @ts-ignore
                APIs[route](req.body)
            )

    server.post(`/api/v1/HARD_UPDATE`, (req, res) => // @ts-ignore
        autoUpdateReducer(req.body)
    )

    const port = await new Promise((r, j) => 
        server.listen({port: 0, host: "::"}, (e,a) => 
            e ? j(e) : r(+a.split(":").pop()!)))

    const url = `http://0.0.0.0:${port}`
    console.log(url)
    OU.open(`${DESTINATION_SETTINGS.runUrl}/?${url}`)
}