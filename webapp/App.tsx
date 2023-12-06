import React, { useState } from "react"
import { RouterProvider, createHashRouter } from "react-router-dom"
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
	const [appData, setAppData] = useState<AppData>({
		token: null,
	})

	return (
		<React.StrictMode>
			<AppContext.Provider value={{ appData, setAppData }}>
				<RouterProvider router={router} />
			</AppContext.Provider>
		</React.StrictMode>
	)
}
