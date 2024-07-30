// import { declareProps, fn, MCast } from "@hwyblvd/st";
import { fn } from "../libs/st.js";
import { ConnectionString, RawQueryString } from "./-props.js";
import { Connect } from "./db-connect.js";
import ppp from "papaparse";

export let 

activeConnection: (...a: any) => Promise<any[]>,

dbProvider: keyof typeof Connect, 

connectionString: string;

export const

// DbProps = declareProps({
//     database: MCast("" as keyof typeof Connect, { type: "string" })
// }),

DbProps = {Database: {database: {} as keyof typeof Connect}},

dbConnect = fn(async props => {
    activeConnection = (await Connect[props.database](props)).queryFunction;
    dbProvider = props.database;
    connectionString = props.connectionString
    return {}
}, DbProps.Database, ConnectionString),

dbQuery = fn(async props => 
    activeConnection(props)
, RawQueryString),

// @ts-ignore
dbIsConnected = fn(async () => activeConnection ? ({ dbProvider, connectionString }) : {}),

dbDisconnect = fn(async props => {
    // @ts-ignore
    activeConnection = undefined;
    // @ts-ignore
    dbProvider = undefined;
    return {}
}),

dbDownload = fn(async props => ({
        csvContent: ppp.unparse(await activeConnection(props), { header: true })    
}), RawQueryString)

;
