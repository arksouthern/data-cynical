import {platform} from "os"
import { DESTINATION_SETTINGS } from "../../destination.settings"
import { chmodSync, cpSync, existsSync, rmSync, writeFileSync } from "fs"
import { spawn } from "child_process"
import { dirname } from "path"

const platformTagMap: Record<ReturnType<typeof platform>, "macOS" | "Windows" | "unknown"> = {
    darwin: "macOS",
    win32: "Windows",
    aix: "unknown",
    android: "unknown",
    cygwin: "unknown",
    freebsd: "unknown",
    haiku: "unknown",
    linux: "unknown",
    netbsd: "unknown",
    openbsd: "unknown",
    sunos: "unknown",
}

export function getPlatformTag() {
    return platformTagMap[platform()]
}

export function getAppName() {
    return DESTINATION_SETTINGS.appName
}

export function getPlatformAppName() {
    const baseName = `${getAppName()}-${getPlatformTag()}`
    return platform() == "win32" ? `${baseName}.exe` : baseName
}
export function getUpdateTagAppName() {
    const baseName = `${getAppName()}-${getPlatformTag()}_UPDATED`
    return platform() == "win32" ? `${baseName}.exe` : baseName
}
function getExecDir() {
    const execFullPath = process.execPath
    return dirname(execFullPath)
}

export async function autoUpdateReducer() {

    /*
        1. Have `./test` download the updated exe to `./test-new`
        2. Have `./test` run `./test-new`
        3. Have `./test-new` kill `./test`
        4. Have `./test-new` copy itself to `./test`
        5. Have `./test-new` run `./test`
        6. Have `./test` kill `./test-new`
        7 Have `./test` remove `./test-new`
    */

   await async function if_HasUpdate_BeginUpdate
   (){
        console.log("if_HasUpdate_BeginUpdate")
        const updateUrl = `${DESTINATION_SETTINGS.repoUrl}/releases/latest`
        const redirectedResponse = await fetch(updateUrl)
        const latestVersion = redirectedResponse.url.split("/").pop()!

        if(DESTINATION_SETTINGS.version == latestVersion)
            return true
        console.log("if_HasUpdate_BeginUpdate")
        const binaryDownload = await fetch(`${DESTINATION_SETTINGS.repoUrl}/releases/download/${latestVersion}/${getPlatformAppName()}`)
        const fileTempPath = `${getExecDir()}/${getUpdateTagAppName()}`
        writeFileSync(fileTempPath, Buffer.from(await binaryDownload.arrayBuffer()))

        if (platform() !== 'win32') 
            chmodSync(fileTempPath, '755')

        const childProcess = spawn(fileTempPath, [], {
            detached: true,
            stdio: 'ignore',
            shell: true
        })
    
        childProcess.unref()
        process.exit()
   }() && autoCleanupReducer()
}

export async function autoCleanupReducer() {
    await async function elseIf_IsUpdating_FinishUpdate
    (){
         console.log("elseIf_IsUpdating_FinishUpdate")
             
         if(!process.execPath.endsWith(getUpdateTagAppName()))
             return true
         console.log("elseIf_IsUpdating_FinishUpdate")
         const originalPath = `${getExecDir()}/${getPlatformAppName()}`
         
         await new Promise((r) => setTimeout(r, 1_000))
         
         rmSync(originalPath, {force: true})
         cpSync(process.execPath, originalPath, {force: true})
 
         const childProcess = spawn(originalPath, [], {
             detached: true,
             stdio: 'ignore',
             shell: true
         });
     
         childProcess.unref();
         process.exit();
    }() &&
    await async function elseIf_JustUpdated_Clean
    (){
         console.log("elseIf_JustUpdated_Clean")
         
         const cleanupNeeded = existsSync(`${getExecDir()}/${getUpdateTagAppName()}`)
         
         if(!cleanupNeeded)
            return true
        
         await new Promise((r) => setTimeout(r, 1_000))
         console.log("elseIf_JustUpdated_Clean")
         rmSync(`${getExecDir()}/${getUpdateTagAppName()}`, {force: true})
    }()
}