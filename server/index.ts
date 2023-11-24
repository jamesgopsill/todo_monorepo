import { Server } from "hyper-express"
import Loki from "lokijs"
import { fileURLToPath } from "url"
import { globalVars } from "./globals.js"

if (import.meta.url.startsWith("file:")) {
	const modulePath = fileURLToPath(import.meta.url)
	if (process.argv[1] === modulePath) {
		console.log("Running from server/index.ts")
		initServer()
	}
}

function initServer() {
	const db = new Loki(globalVars.DB_FILE, {
		autoload: true,
		autoloadCallback: initRestAPI,
		autosave: true,
		autosaveInterval: 4000,
	})

	function initRestAPI() {
		// Initialise the users collection here.

		// Create the REST API
		const app = new Server()
		const port = 3000
		app
			.listen(port)
			.then(() => {
				console.log(`Server started on port http://localhost:${port}`)
			})
			.catch((error: any) => {
				console.log(`Failed to Start`)
				console.log(error)
				process.exit()
			})
	}

	process.on("SIGINT", function () {
		console.log("Closing the Database")
		db.close()
		console.log("Database closed.")
		process.exit()
	})
}
