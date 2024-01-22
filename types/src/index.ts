import { FormatRegistry, Static, Type } from "@sinclair/typebox"
import type { Collection } from "lokijs"

export interface ToDo {
	id: string
	text: string
	createdById: string
	createdDate: Date
}

export const PostToDoArgs = Type.Object(
	{
		text: Type.String(),
	},
	{
		additionalProperties: false,
	},
)
export type PostToDoArgs = Static<typeof PostToDoArgs>

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
	collections: {
		users: Collection<User>
		todos: Collection<ToDo>
	}
}

export interface ResponseBody<T = any> {
	error: string | null
	data: T
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

export const EmptyObject = Type.Object({}, { additionalProperties: false })
export type EmptyObject = Static<typeof EmptyObject>

export type HttpResponse<T> =
	| ({
			ok: true
			status: 200
			content: {
				error: null
				data: T
			}
	  } & Response)
	| ({
			ok: true
			status: 204
			content: undefined
	  } & Response)
	| ({
			ok: false
			status: 400
			content: {
				error: string
				data: any
			}
	  } & Response)
