import { randomUUID } from "crypto"
import { Router, UserRouteHandler } from "hyper-express"
import { PostToDoArgs, ToDo, UserScopes } from "types"
import { authorise } from "../middlewares/authorise.js"
import { validate } from "../middlewares/validate.js"
import { typeArgsContextSend } from "../types.js"

const post: UserRouteHandler = async (request, response) => {
	const { args, ctx, send } = await typeArgsContextSend<PostToDoArgs>(
		request,
		response,
	)

	if (!ctx.user) {
		return send(400, {
			error: "No user exists",
			data: null,
		})
	}

	const todo: ToDo = {
		id: randomUUID(),
		text: args.text,
		createdById: ctx.user.id,
		createdDate: new Date(),
	}

	try {
		ctx.collections.todos.insert(todo)
		return send(200, {
			error: null,
			data: "success",
		})
	} catch (e: any) {
		return send(500, {
			error: e.message,
			data: null,
		})
	}
}

const get: UserRouteHandler = async (request, response) => {
	const { ctx, send } = await typeArgsContextSend(request, response)

	if (!ctx.user) {
		return send(400, {
			error: "No user exists",
			data: null,
		})
	}

	const todos = ctx.collections.todos.find({
		createdById: { $eq: ctx.user.id },
	})

	return send(200, {
		error: null,
		data: todos,
	})
}

const remove: UserRouteHandler = async (request, response) => {
	const { ctx, send } = await typeArgsContextSend(request, response)

	if (!ctx.user) {
		return send(400, {
			error: "No user exists",
			data: null,
		})
	}

	const todoId = request.path_parameters["id"]
	if (!todoId) {
		send(400, {
			error: "No todo id",
			data: null,
		})
		return
	}

	const todo = ctx.collections.todos.by("id", todoId)
	if (!todo) {
		send(400, {
			error: "No todo with that id",
			data: null,
		})
		return
	}

	if (
		ctx.user.id == todo.createdById ||
		ctx.user.scopes.includes(UserScopes.ADMIN)
	) {
		try {
			ctx.collections.todos.remove(todo)
			return send(200, {
				error: null,
				data: "success",
			})
		} catch (e: any) {
			return send(500, {
				error: e.message,
				data: null,
			})
		}
	}

	send(400, {
		error: "You are not authorised",
		data: null,
	})
	return
}

export const todoRouter: Router = new Router()

todoRouter.post("/", [authorise(UserScopes.USER), validate(PostToDoArgs)], post)
todoRouter.get("/", [authorise(UserScopes.USER)], get)
todoRouter.delete("/:id", [authorise(UserScopes.USER)], remove)
