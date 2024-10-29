import { fastify } from "fastify"
import cors from '@fastify/cors'
import OU from "openurl"
import { readFile } from "fs/promises"
import Y from "yargs"
import {hideBin} from "yargs/helpers"
import * as APIs from "./api/v1"
import { DESTINATION_SETTINGS } from "./destination.settings"
import { autoUpdateReducer } from "./destination/update-git"

start().catch(console.log)

async function start() {

    const args = await Y(hideBin(process.argv)).argv
    const portArg = args.dev ? 3070 : 0
    const openArg = args.dev ? false : true

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

    const server = fastify({ logger: false })

    server.register(cors, {origin: true})
    
    const proxyFetchHtml = `<script>${await readFile("./destination/proxy-fetch.js", "utf-8")}</script>`
    server.get("/PROXY", (req, res) => 
        res.type('text/html').send(proxyFetchHtml)
    )

    for (const route in APIs) // @ts-ignore
        if(typeof APIs[route] == "function") // @ts-ignore
            server.post(`/api/v1/${route}`, (req, res) => // @ts-ignore
                APIs[route](req.body)
            )

    server.post(`/api/v1/HARD_UPDATE`, (req, res) => // @ts-ignore
        autoUpdateReducer(req.body)
    )

    try {
        const port = await new Promise((r,j) => server.listen({ port: portArg, host: "::",  }, (e,a) => e ? j(e) : r(a))) as string
        const url = `${DESTINATION_SETTINGS.runUrl}/?http://localhost:${port.split(":").pop()}`
        console.log(url)
        if (openArg) OU.open(url)
    } catch (error) {
        // @ts-ignore
         console.log(error.message)
    }
}