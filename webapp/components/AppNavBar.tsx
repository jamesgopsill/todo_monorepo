import { Container, Navbar } from "react-bootstrap"
import { AppNavBarButtons } from "./AppNavBarButtons"

export function AppNavBar() {
	return (
		<Navbar expand="sm" className="bg-body-secondary">
			<Container>
				<Navbar.Brand href="#">My TODO App</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-end">
					<AppNavBarButtons />
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
