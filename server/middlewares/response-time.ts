import { MiddlewareHandler } from "hyper-express"

export const responseTime: MiddlewareHandler = (request, response, next) => {
	console.log(`responseTime (Down): ${request.url}`)
	const start = process.hrtime()
	response.on("prepare", () => {
		const elapsedTime = process.hrtime(start)
		const elapsedTimeInMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6
		response.header("X-Response-Time", `${elapsedTimeInMs}ms`)
	})
	next()
	console.log(`responseTime (Up): ${request.url}`)
	return
}
