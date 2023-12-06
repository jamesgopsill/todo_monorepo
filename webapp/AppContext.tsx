import { createContext } from "react"

export interface AppData {
	token: string | null
}

type AppContextData = {
	appData: AppData
	setAppData: (data: AppData) => void
}

export const AppContext = createContext<AppContextData>({
	appData: {
		token: null,
	},
	setAppData: () => {},
})
