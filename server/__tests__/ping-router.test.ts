import { Client } from "client"
import assert from "node:assert"
import test, { after, before, describe } from "node:test"

describe(`Ping Router Tests`, { concurrency: 1 }, () => {
	let client: Client

	before(async () => {
		client = new Client()
		client.endpoint = "http://localhost:3000"
	})

	test("GET /api/ping", async () => {
		const { status, content } = await client.ping()
		assert.strictEqual(status, 200)
		assert.strictEqual(content.data, "pong")
	})

	after(async () => {
		process.exit()
	})
})
