import type { PostToDoArgs, ToDo } from "types"
import { Client } from "../index.js"

export class ToDoEndpoint {
	protected client: Client

	constructor(c: Client) {
		this.client = c
	}

	public post = post
	public remove = remove
	public get = get
}

function post(this: ToDoEndpoint, params: PostToDoArgs) {
	const url = `/todo`
	return this.client._fetch<string>("POST", url, params)
}

function remove(this: ToDoEndpoint, id: string) {
	const url = `/todo/${id}`
	return this.client._fetch<string>("DELETE", url)
}

function get(this: ToDoEndpoint) {
	const url = `/todo`
	return this.client._fetch<ToDo[]>("GET", url)
}
