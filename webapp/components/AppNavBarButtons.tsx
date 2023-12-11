import { Client } from "client"
import { useContext } from "react"
import { Nav } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { AppContext } from "../AppContext"

export function AppNavBarButtons() {
	const { appData, setAppData } = useContext(AppContext)
	const navigate = useNavigate()

	const logout = () => {
		console.log("logging out")
		setAppData({
			token: null,
			client: new Client(),
			user: null,
		})
		localStorage.clear()
		navigate("/")
	}

	if (appData.user) {
		return (
			<Nav>
				<Nav.Link href="#" disabled>
					{appData.user.name}
				</Nav.Link>
				<Nav.Link href="#" onClick={logout}>
					Logout
				</Nav.Link>
			</Nav>
		)
	}

	return (
		<Nav>
			<Nav.Link href="#register">Register</Nav.Link>
			<Nav.Link href="#login">Login</Nav.Link>
		</Nav>
	)
}
