import { spawn } from "child_process"
import { initServer } from "../index.js"

initServer()

const p = spawn("pnpm", ["run:tests"], {
	stdio: "inherit",
})

p.on("close", (code) => {
	console.log(`child process exited with code ${code}`)
	process.exit()
})
