import { Client } from "client"
import assert from "node:assert"
import test, { after, before, describe } from "node:test"

describe(`ToDo Tests`, { concurrency: 1 }, () => {
	let client: Client
	let tid: string | undefined = undefined

	before(async () => {
		client = new Client()
		client.endpoint = `http://localhost:3000`

		const { status, content } = await client.user.login({
			email: "admin@todo.com",
			password: "admin",
		})

		if (status != 200) {
			console.log("No user found")
			process.exit()
		}

		if (content) client.token = content.data
	})

	test("POST /todo", async () => {
		const { status } = await client.todo.post({
			text: "A todo",
		})
		assert.strictEqual(status, 200)
	})

	test("GET /todo", async () => {
		const { status, content } = await client.todo.get()
		assert.strictEqual(status, 200)
		tid = content.data[0]?.id
		assert.strictEqual(typeof tid, "string")
	})

	test("DELETE /todo", async () => {
		if (tid) {
			const { status } = await client.todo.remove(tid)
			assert.strictEqual(status, 200)
		} else {
			assert.strictEqual(true, false)
		}
	})

	after(async () => {
		process.exit()
	})
})
