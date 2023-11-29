import { TSchema } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"
import type { MiddlewareHandler } from "hyper-express"

export const validate = (schema: TSchema) => {
	const v: MiddlewareHandler = (request, response, next) => {
		console.log(`validate (Down) ${request.url}`)
		//@ts-expect-error
		if (request._body_json == undefined) {
			console.log(
				"Validate requires body to have been called first and the json cached.",
			)
			return response.status(500).json({
				error: "parse body not implement",
				data: null,
			})
		}

		//@ts-expect-error
		if (!Value.Check(schema, request._body_json)) {
			return response.status(400).json({
				error: "Invalid request. See data for details.",
				//@ts-expect-error
				data: [...Value.Errors(schema, request._body_json)],
			})
		}
		next()
		console.log(`validate (Up) ${request.url}`)
		return
	}
	return v
}
