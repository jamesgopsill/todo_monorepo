import { useContext } from "react"
import { Button, Form } from "react-bootstrap"
import { AppContext } from "../AppContext"

export function RegisterPage() {
	const { appData } = useContext(AppContext)

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		const { status, content } = await appData.client.user.register({
			name: event.target.name.value,
			email: event.target.email.value,
			confirmEmail: event.target.confirmEmail.value,
			password: event.target.password.value,
			confirmPassword: event.target.confirmPassword.value,
		})
		if (status == 200) {
			alert("Success! Thank you for registering")
			return
		}
		alert("Error Logging In")
		console.log(content)
		return
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Form.Group>
				<Form.Label>Name</Form.Label>
				<Form.Control name="name" type="text" />
			</Form.Group>
			<Form.Group>
				<Form.Label>Email Address</Form.Label>
				<Form.Control name="email" type="email" />
			</Form.Group>
			<Form.Group>
				<Form.Label>Confirm Email Address</Form.Label>
				<Form.Control name="confirmEmail" type="email" />
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control name="password" type="password" />
			</Form.Group>
			<Form.Group>
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control name="confirmPassword" type="password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				Register
			</Button>
		</Form>
	)
}
