import { Container, Navbar } from "react-bootstrap"

export function AppNavBar() {
	return (
		<Navbar expand="sm" className="bg-body-secondary">
			<Container>
				<Navbar.Brand href="#">My TODO App</Navbar.Brand>
			</Container>
		</Navbar>
	)
}
