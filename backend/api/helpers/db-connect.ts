import * as fs from "fs"
import path from "path";
import { IConnect } from "./-interfaces.js";

export const Connect = {
    SQLITE: IConnect.onConnect({
        connectFunction: async props => {
            const SQLITE = (await import("sql.js")).default;
            console.log(fs.readFileSync(props.connectionString))
            path.resolve()
            const internalConnection = new (await SQLITE()).Database(fs.readFileSync(props.connectionString));
            
            return {
                queryFunction: async props => {
                    const result = internalConnection.exec(props.rawQueryString)[0];
                    return !result ? [] :  result.values.map(row => Object.fromEntries(row.map((x,i) => [result.columns[i], x])))
                }
            }
        }
    }),
    MSSQL: IConnect.onConnect({
        connectFunction: async props => {
            const MSSQL = await import("mssql");
            await MSSQL.connect(props.connectionString);
        
            return {
                queryFunction: async props => 
                    (await MSSQL.query(props.rawQueryString)).recordset
            }
        }
    }), 
    MYSQL: IConnect.onConnect({
        connectFunction: async props => {
            const MYSQL = await import("mysql");
            const internalConnection = MYSQL.createConnection(props.connectionString);
        
            internalConnection.connect();
        
            return {
                queryFunction: props => {
                    let promiseResolve: (v:any)=>void;
                    let promiseReject: (v:any)=>void;
                    const promise = new Promise((res, rej) => {
                        promiseResolve = res;
                        promiseReject = rej;
                    });
                    internalConnection.query(props.rawQueryString, (error, results, fields) => 
                        error 
                            ? promiseReject(error) 
                            : promiseResolve(results)
                    );
                    return promise as any;
                }
            }
        }
    }),
    ACCESS: IConnect.onConnect({
        connectFunction: async props => {
            const ACCESS = (await import("mdb-reader")).default;
            const internalConnection = new ACCESS(fs.readFileSync(props.connectionString));
            
            return {
                queryFunction: async props => {
                    throw new Error(`Query raw not implemented.`);
                    /** @ts-ignore */
                    return internalConnection.query(props.rawQueryString);
                }
            }
        }
    }),
    POSTGRESQL: IConnect.onConnect({
        connectFunction: async props => {
            const POSTGRESQL = (await import("postgres")).default;
            // const { Client: POSTGRESQL } = _pg_;
            const internalConnection = POSTGRESQL(props.connectionString);
            return {
                queryFunction: async props => 
                    (await internalConnection.unsafe(props.rawQueryString))
            }
        }
    }) 
}
