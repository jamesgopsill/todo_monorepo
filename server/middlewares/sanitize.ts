import { MiddlewareHandler } from "hyper-express"

export const sanitize: MiddlewareHandler = (_, response, next) => {
	const json = response.json
	//@ts-expect-error
	response.json = function (body: any) {
		if (body.data != null) sanitizeResponseObject(body.data)
		json.call(this, body)
	}
	next()
}

const sanitizeResponseObject = (obj: any) => {
	if (obj != null && typeof obj == "object" && Array.isArray(obj) == false) {
		delete obj["salt"]
		delete obj["hash"]
		delete obj["meta"]
		delete obj["$loki"]

		for (const o of Object.values(obj)) {
			if (typeof o == "object") sanitizeResponseObject(o)
		}
	}

	if (obj != null && typeof obj == "object" && Array.isArray(obj) == true) {
		for (const o of obj) {
			sanitizeResponseObject
		}
	}
}
