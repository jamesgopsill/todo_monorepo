import { FormatRegistry, Static, Type } from "@sinclair/typebox"
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

FormatRegistry.Set("email", (value) =>
	/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
		value,
	),
)

export const RegisterArgs = Type.Object(
	{
		name: Type.String(),
		email: Type.String({
			format: "email",
		}),
		confirmEmail: Type.String({
			format: "email",
		}),
		password: Type.String(),
		confirmPassword: Type.String(),
	},
	{
		additionalProperties: false,
	},
)
export type RegisterArgs = Static<typeof RegisterArgs>

export const LoginArgs = Type.Object(
	{
		email: Type.String({
			format: "email",
		}),
		password: Type.String(),
	},
	{
		additionalProperties: false,
	},
)
export type LoginArgs = Static<typeof LoginArgs>
