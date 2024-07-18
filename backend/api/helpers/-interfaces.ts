// import { declareProps, fn } from "@hwyblvd/st"
import { fn } from "../libs/st.js";
import { ConnectionString, RawQueryString } from "./-props.js"

const

QueryFunction = {queryFunction: fn(async ()=>[{}], RawQueryString)}
,
ConnectFunction = {connectFunction: fn(async ()=>QueryFunction, ConnectionString)}

// const { QueryFunction } = declareProps({
//     queryFunction: fn(async ()=>[{}], RawQueryString)
// });
// const { ConnectFunction } = declareProps({
//     connectFunction: fn(async ()=>QueryFunction, ConnectionString),
// });

export const IConnect = {
    onConnect: fn(p1 => fn(async p2 => p1.connectFunction(p2), ConnectionString), ConnectFunction)
};