// import { execSync } from "child_process"
const { execSync, spawnSync } = require("child_process")

const res = spawnSync("npm run serve", {
    stdio: 'inherit', 
    shell: true, 
    cwd: __dirname,
})
