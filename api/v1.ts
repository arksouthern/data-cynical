import "./helpers/-onstartup.js";
// import { fn } from "@hwyblvd/st";
import { DESTINATION_SETTINGS } from "../destination.settings.js"
import { fn } from "./libs/st.js";

export const apiHealthCheckConnect = fn(async props => { 
    return {message: DESTINATION_SETTINGS.version}})


export {
    dbConnect,
    dbQuery,
    dbIsConnected,
    dbDisconnect,
    dbDownload,
} from "./helpers/-db.js";