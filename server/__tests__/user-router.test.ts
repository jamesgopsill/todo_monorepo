import { Client } from "client"
import assert from "node:assert"
import test, { after, before, describe } from "node:test"

describe(`User Tests`, { concurrency: 1 }, () => {
	let client: Client

	before(async () => {
		client = new Client()
		client.endpoint = `http://localhost:3000`
	})

	after(async () => {
		process.exit()
	})

	test("POST /user/register", async () => {
		const { status, content } = await client.user.register({
			name: "test",
			email: "test@test.com",
			confirmEmail: "test@test.com",
			password: "test",
			confirmPassword: "test",
		})
		assert.strictEqual(status, 200)
		console.log(content)
	})

	test("POST /user/login", async () => {
		const { status, content } = await client.user.login({
			email: "test@test.com",
			password: "test",
		})
		assert.strictEqual(status, 200)
		console.log(content)
		if (content) client.token = content.data
	})

	test("GET /user/me", async () => {
		const { status, content } = await client.user.me()
		assert.strictEqual(status, 200)
		console.log(content)
	})

	test("GET /user/refresh", async () => {
		const { status, content } = await client.user.refresh()
		assert.strictEqual(status, 200)
		console.log(content)
	})
})
