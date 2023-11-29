import { MiddlewareHandler } from "hyper-express"

export const sanitize: MiddlewareHandler = (_, response, next) => {
	console.log(`sanitize (Down)`)
	const json = response.json
	response.json = function (body: any) {
		if (body.data != null) sanitizeResponseObject(body.data)
		return json.call(this, body)
	}
	next()
	console.log(`sanitize (Up)`)
	return
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
