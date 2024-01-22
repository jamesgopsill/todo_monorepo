import { Request, Response } from "hyper-express"
import { Locals } from "types"

export interface ResponseBody<T = any> {
	error: string | null
	data: T
}

export async function typeArgsContextSend<Args = unknown>(
	request: Request,
	response: Response,
) {
	return {
		args: (await request.json()) as Args,
		ctx: request.locals as Locals,
		send: (status: number, json: ResponseBody) => {
			return response.status(status).json(json)
		},
	}
}
