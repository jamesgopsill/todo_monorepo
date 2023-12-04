import { LoginArgs, RegisterArgs, User } from "server"
import { Client } from "../index.js"

export interface UserMeResponse extends Omit<User, "salt" | "hash"> {}

export class UserEndpoint {
	protected client: Client

	constructor(c: Client) {
		this.client = c
	}

	public register = register
	public login = login
	public refresh = refresh
	public me = me
}

function register(this: UserEndpoint, params: RegisterArgs) {
	const url = `/user/register`
	return this.client._fetch<string>("POST", url, params)
}

function login(this: UserEndpoint, params: LoginArgs) {
	const url = `/user/login`
	return this.client._fetch<string>("POST", url, params)
}

function refresh(this: UserEndpoint) {
	const url = `/user/refresh`
	return this.client._fetch<string>("POST", url)
}

function me(this: UserEndpoint) {
	const url = `/user/me`
	return this.client._fetch<UserMeResponse>("GET", url)
}
