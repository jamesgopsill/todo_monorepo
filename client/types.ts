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
