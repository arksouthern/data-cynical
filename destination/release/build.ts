import {renameSync, mkdirSync, rmSync, readdirSync} from "fs"
import {execSync} from "child_process"
import { getAppName, getPlatformAppName } from "./update"

rmSync(`dist`, {force: true, recursive: true})

execSync(`npx tsc-transpile-only`)

execSync(`npx pkg package.json --compress Brotli --target node18 --output exec`)

const outputFileName = readdirSync(`.`).find(fileName => fileName.includes(`exec`))!

mkdirSync(`dist/${getAppName()}`, {recursive: true})

renameSync(outputFileName, `dist/${getAppName()}/${getPlatformAppName()}`)