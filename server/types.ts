import { Request, Response } from "hyper-express"
import { Collection } from "lokijs"

export enum UserScopes {
	USER = "USER",
	ADMIN = "ADMIN",
}

export interface User {
	id: string
	name: string
	email: string
	scopes: UserScopes[]
	salt: string
	hash: string
}

export interface DecodedUserToken extends Omit<User, "salt" | "hash"> {
	iat: number
}

export interface Locals {
	user: null | DecodedUserToken
	usersCollection: Collection<User>
}

export interface ResponseBody {
	error: string | null
	data: any
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
