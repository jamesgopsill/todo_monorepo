import { MiddlewareHandler } from "hyper-express"

export const parseBody: MiddlewareHandler = (request, response, next) => {
	console.log(`parseBody (Down): ${request.url}`)
	request
		.json()
		.then(() => {
			console.log(`parseBody (Next)`)
			next()
			console.log(`parseBody (Up)`)
		})
		.catch((err) => {
			return response.status(500).json({
				error: err.message,
				data: null,
			})
		})
}
