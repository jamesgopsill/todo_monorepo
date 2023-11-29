import { ResponseBody } from "server"
import { HttpResponse } from "./types"

export class Client {
	public endpoint: string
	public token: string

	constructor() {
		this.endpoint = ""
		this.token = ""
	}

	public _fetch = _fetch

	public ping = () => {
		const url = "/ping"
		return this._fetch<ResponseBody<string>>("GET", url)
	}
}

async function _fetch<T>(
	this: Client,
	method: "GET" | "POST" | "PUT" | "PATCH",
	url: string,
	params: { [key: string]: any } | undefined = undefined,
) {
	console.log(`client fetch: ${this.endpoint}/api${url}`)
	let config: any = {
		method,
		mode: "cors",
		headers: {},
	}
	if (typeof params === "object") {
		config.headers["content-type"] = "application/json"
		config.body = JSON.stringify(params)
	}
	if (this.token.length > 0) {
		config.headers["authorization"] = `Bearer ${this.token}`
	}
	const request = new Request(`${this.endpoint}/api${url}`, config)
	const response = (await fetch(request)) as HttpResponse<T>
	response.content = undefined
	if ([200, 400].includes(response.status)) {
		const contentType = response.headers.get("content-type")
		if (contentType && contentType.includes("application/json")) {
			let content = await response.json()
			// turn string dates into date objects
			recursiveProcessObjectDates(content)
			response.content = content
		}
	}
	return response
}

function recursiveProcessObjectDates(obj: { [key: string]: any }) {
	const re = new RegExp(
		/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
	)
	for (const [key, value] of Object.entries(obj)) {
		// if typeof string
		if (typeof value == "string") {
			if (re.test(value)) {
				obj[key] = new Date(value)
			}
			continue
		}
		if (value == null || value == undefined) {
			continue
		}
		// If it is an array then iterate through the objects and perform the recursive process objects
		// if typeof []
		if (typeof value == "object" && Array.isArray(value) == true) {
			value.map((element: any) => {
				recursiveProcessObjectDates(element)
			})
		}
		// if it is an object then process it
		if (typeof value == "object" && Array.isArray(value) == false) {
			recursiveProcessObjectDates(value)
		}
	}
}
