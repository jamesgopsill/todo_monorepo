import { useContext } from "react"
import { Outlet } from "react-router-dom"
import { AppContext } from "../AppContext"
import { UnauthorisedPage } from "../pages/UnauthorisedPage"

export function AuthenticatedRoute() {
	const { appData } = useContext(AppContext)
	if (appData.token) {
		return <Outlet />
	}
	return <UnauthorisedPage />
}
