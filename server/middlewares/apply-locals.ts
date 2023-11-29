import { MiddlewareHandler } from "hyper-express"

export const applyLocals = (locals: { [key: string]: any }) => {
	const apply: MiddlewareHandler = (request, _, next) => {
		console.log(`applyLocals (Down): ${request.url}`)
		for (const [key, value] of Object.entries(locals)) {
			request.locals[key] = value
		}
		next()
		console.log(`applyLocals (Up): ${request.url}`)
		return
	}
	return apply
}
