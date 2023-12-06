import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import { AppFooter } from "./AppFooter"
import { AppNavBar } from "./AppNavBar"

export function Root() {
	return (
		<>
			<AppNavBar />
			<Container className="mt-5">
				<Outlet />
			</Container>
			<AppFooter />
		</>
	)
}
