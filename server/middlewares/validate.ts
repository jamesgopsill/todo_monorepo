import { TSchema } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"
import type { MiddlewareHandler } from "hyper-express"

export const validate = (schema: TSchema) => {
	const validate: MiddlewareHandler = async (request, response, next) => {
		const data = await request.json()
		if (!Value.Check(schema, data)) {
			return response.status(400).json({
				error: "Invalid request. See data for details.",
				data: [...Value.Errors(schema, data)],
			})
		}
		return next()
	}
	return validate
}
