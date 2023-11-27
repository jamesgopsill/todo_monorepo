import type { MiddlewareHandler } from "hyper-express"
import { Locals, UserScopes } from "../types.js"

export const authorise = (scope: UserScopes) => {
	const authorise: MiddlewareHandler = (request, response, next) => {
		console.log(`authorise: ${request.url}`)
		const locals = request.locals as Locals

		if (locals.user === null) {
			return response.status(400).json({
				error: "No User",
				data: null,
			})
		}

		if (!locals.user.scopes.includes(scope)) {
			return response.status(400).json({
				error: "Not Authorised",
				data: null,
			})
		}

		return next()
	}
	return authorise
}
