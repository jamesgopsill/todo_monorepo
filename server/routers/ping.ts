import { Router, UserRouteHandler } from "hyper-express"
import { EmptyObject } from "types"
import { validate } from "../middlewares/validate.js"
import { typeArgsContextSend } from "../types.js"

const ping: UserRouteHandler = async (request, response) => {
	console.log(`ping: ${request.url}`)
	const { send } = await typeArgsContextSend(request, response)
	return send(200, {
		error: null,
		data: "pong",
	})
}

export const pingRouter = new Router()
pingRouter.get("/ping", [validate(EmptyObject)], ping)
