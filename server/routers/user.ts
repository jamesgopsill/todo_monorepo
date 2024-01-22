import { pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from "crypto"
import { Router, UserRouteHandler } from "hyper-express"
import jwt from "jsonwebtoken"
import { LoginArgs, RegisterArgs, User, UserScopes } from "types"
import { globalVars } from "../globals.js"
import { authorise } from "../middlewares/authorise.js"
import { validate } from "../middlewares/validate.js"
import { typeArgsContextSend } from "../types.js"

const register: UserRouteHandler = async (request, response) => {
	console.log(`register: ${request.url}`)
	const { args, ctx, send } = await typeArgsContextSend<RegisterArgs>(
		request,
		response,
	)

	if (args.email != args.confirmEmail) {
		return send(400, {
			error: "Emails do not match",
			data: null,
		})
	}

	if (args.password != args.confirmPassword) {
		return send(400, {
			error: "Passwords do not match",
			data: null,
		})
	}

	const user = ctx.collections.users.by("email", args.email)
	if (user) {
		return send(400, {
			error: "User already exists",
			data: null,
		})
	}

	const salt = randomBytes(16)
	const hash = pbkdf2Sync(args.password, salt, 310000, 32, "sha256")

	try {
		const user: User = {
			id: randomUUID(),
			name: args.name,
			email: args.email,
			hash: hash.toString("hex"),
			salt: salt.toString("hex"),
			scopes: [UserScopes.USER],
		}
		ctx.collections.users.insert(user)
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

const login: UserRouteHandler = async (request, response) => {
	console.log(`login: ${request.url}`)
	const { args, ctx, send } = await typeArgsContextSend<LoginArgs>(
		request,
		response,
	)

	const user = ctx.collections.users.by("email", args.email)
	if (!user) {
		return send(400, {
			error: "User does not exist",
			data: null,
		})
	}

	try {
		const salt = Buffer.from(user.salt, "hex")
		const hash = Buffer.from(user.hash, "hex")

		const pwdHash = pbkdf2Sync(args.password, salt, 310000, 32, "sha256")
		if (!timingSafeEqual(hash, pwdHash)) {
			return send(400, {
				error: "Passwords do not match",
				data: null,
			})
		}

		const data = {
			id: user.id,
			name: user.name,
			scopes: user.scopes,
			iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
		}

		const token = jwt.sign(data, globalVars.JWT_SECRET, {
			algorithm: "HS256",
		})

		return send(200, {
			error: null,
			data: `Bearer ${token}`,
		})
	} catch (e: any) {
		return send(500, {
			error: e.message,
			data: null,
		})
	}
}

const refresh: UserRouteHandler = async (request, response) => {
	console.log(`Refresh: ${request.url}`)
	const { ctx, send } = await typeArgsContextSend(request, response)

	if (!ctx.user) {
		return send(400, {
			error: "No user",
			data: null,
		})
	}

	const data = {
		id: ctx.user.id,
		email: ctx.user.email,
		scopes: ctx.user.scopes,
		iat: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
	}

	const token = jwt.sign(data, globalVars.JWT_SECRET, {
		algorithm: "HS256",
	})

	return send(200, {
		error: null,
		data: `Bearer ${token}`,
	})
}

const me: UserRouteHandler = async (request, response) => {
	console.log(`Me: ${request.url}`)
	const { ctx, send } = await typeArgsContextSend(request, response)

	if (!ctx.user) {
		return send(400, {
			error: "No user",
			data: null,
		})
	}

	const user = ctx.collections.users.by("id", ctx.user.id)
	if (!user) {
		return send(400, {
			error: "No user found",
			data: null,
		})
	}

	return send(200, {
		error: null,
		data: user,
	})
}

export const userRouter: Router = new Router()

userRouter.post("/register", [validate(RegisterArgs)], register)
userRouter.post("/login", [validate(LoginArgs)], login)
userRouter.post("/refresh", [authorise(UserScopes.USER)], refresh)
userRouter.get("/me", [authorise(UserScopes.USER)], me)
