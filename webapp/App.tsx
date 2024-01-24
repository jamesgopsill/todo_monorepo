import { Client } from "client"
import { jwtDecode } from "jwt-decode"
import React, { useState } from "react"
import { RouterProvider, createHashRouter } from "react-router-dom"
import { DecodedUserToken } from "types"
import { AppContext, AppData } from "./AppContext"
import { AuthenticatedRoute } from "./components/AuthenticatedRoute"
import { Root } from "./components/Root"
import { ErrorPage } from "./pages/ErrorPage"
import { HomePage } from "./pages/HomePage"
import { IndexPage } from "./pages/IndexPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"

const router = createHashRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <IndexPage />,
			},
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/register",
				element: <RegisterPage />,
			},
			{
				path: "/home",
				element: <AuthenticatedRoute />,
				children: [
					{
						path: "/home",
						element: <HomePage />,
					},
				],
			},
		],
	},
])

export function App() {
	const token = localStorage.getItem("token")
	const client = new Client()
	let user = null
	if (token) {
		client.token = token
		user = jwtDecode(token) as DecodedUserToken
	}

	const [appData, setAppData] = useState<AppData>({
		token: token,
		client: client,
		user: user,
	})

	return (
		<React.StrictMode>
			<AppContext.Provider value={{ appData, setAppData }}>
				<RouterProvider router={router} />
			</AppContext.Provider>
		</React.StrictMode>
	)
}
