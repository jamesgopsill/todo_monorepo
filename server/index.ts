import { pbkdf2Sync, randomBytes, randomUUID } from "crypto"
import { MiddlewareHandler, Server } from "hyper-express"
import Loki from "lokijs"
import { fileURLToPath } from "url"
import { globalVars } from "./globals.js"
import { authenticate } from "./middlewares/authenticate.js"
import { responseTime } from "./middlewares/response-time.js"
import { sanitize } from "./middlewares/sanitize.js"
import { pingRouter } from "./routers/ping.js"
import { userRouter } from "./routers/user.js"
import { Locals, User, UserScopes } from "./types.js"

export * from "./types.js"

if (import.meta.url.startsWith("file:")) {
	const modulePath = fileURLToPath(import.meta.url)
	if (process.argv[1] === modulePath) {
		console.log("Running from server/index.ts")
		initServer()
	}
}

export function initServer() {
	const db = new Loki(globalVars.DB_FILE, {
		autoload: true,
		autoloadCallback: initRestAPI,
		autosave: true,
		autosaveInterval: 4000,
	})

	function initRestAPI() {
		// Initialise the users collection here.
		const usersCollection = initUsersCollection(db)

		const defaultLocalContext: MiddlewareHandler = (request, _, next) => {
			console.log(`defaultLocalContext: ${request.url}`)
			let ctx = request.locals as Locals
			ctx.user = null
			ctx.usersCollection = usersCollection
			next()
		}

		// Create the REST API
		const app = new Server()
		app.use(responseTime)
		app.use(sanitize)
		app.use(defaultLocalContext)
		app.use(authenticate)

		app.use("/api", pingRouter)
		app.use("/api/user", userRouter)

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

function initUsersCollection(db: Loki) {
	let usersCollection = db.getCollection<User>("users")
	if (usersCollection == null) {
		usersCollection = db.addCollection<User>("users", {
			indices: ["id", "email"],
			clone: true,
		})
		const salt = randomBytes(16)
		const hash = pbkdf2Sync("admin", salt, 310000, 32, "sha256")
		const id = randomUUID()
		const user: User = {
			id: id,
			name: "admin",
			email: "admin@todo.com",
			hash: hash.toString("hex"),
			salt: salt.toString("hex"),
			scopes: [UserScopes.USER, UserScopes.ADMIN],
		}
		usersCollection.insert(user)
	}
	return usersCollection
}
