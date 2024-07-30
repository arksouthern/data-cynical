import {platform} from "os"
import { DESTINATION_SETTINGS } from "../../destination.settings"
import { chmodSync, cpSync, existsSync, rmSync, writeFileSync } from "fs"
import { spawn } from "child_process"
import { dirname } from "path"


export async function autoUpdateReducer() {
    return {}
}