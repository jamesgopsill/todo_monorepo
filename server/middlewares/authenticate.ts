import { MiddlewareHandler } from "hyper-express"
import jwt from "jsonwebtoken"
import { globalVars } from "../globals.js"
import { DecodedUserToken, Locals } from "../types.js"

export const authenticate: MiddlewareHandler = (request, response, next) => {
	console.log(`authenticate: ${request.url}`)
	const ctx = request.locals as Locals

	if (!request.headers["authorization"]) {
		next()
		return
	}

	const authorization = request.headers["authorization"]

	if (!authorization.includes("Bearer")) {
		return response.status(400).json({
			error: "Invalid token format (1)",
			data: null,
		})
	}

	const token = authorization.split(" ").pop()
	if (!token) {
		return response.status(400).json({
			error: "Invalid token format (2)",
			data: null,
		})
	}

	try {
		const decoded = jwt.verify(token, globalVars.JWT_SECRET) as DecodedUserToken
		ctx.user = decoded
		next()
		return
	} catch (e: any) {
		return response.status(500).json({
			error: e.message,
			data: null,
		})
	}
}
