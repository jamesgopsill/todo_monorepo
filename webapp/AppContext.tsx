import { Client } from "client"
import { createContext } from "react"

export enum UserScopes {
	USER = "USER",
	ADMIN = "ADMIN",
}

export interface DecodedUserToken {
	id: string
	name: string
	email: string
	scopes: UserScopes[]
	iat: number
}

export interface AppData {
	token: string | null
	client: Client
	user: DecodedUserToken | null
}

type AppContextData = {
	appData: AppData
	setAppData: (data: AppData) => void
}

export const client = new Client()

export const AppContext = createContext<AppContextData>({
	appData: {
		token: null,
		user: null,
		client: client,
	},
	setAppData: () => {},
})
