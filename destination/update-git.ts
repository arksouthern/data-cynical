import { execSync } from "child_process"

export const autoUpdateReducer = () => {
    execSync("git fetch; git pull;")
}