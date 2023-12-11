import { jwtDecode } from "jwt-decode"
import { useContext } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { AppContext, DecodedUserToken } from "../AppContext"

export function LoginPage() {
	const { appData, setAppData } = useContext(AppContext)
	const navigate = useNavigate()

	const login = async (event: any) => {
		event.preventDefault()
		const { status, content } = await appData.client.user.login({
			email: event.target.email.value,
			password: event.target.password.value,
		})
		console.log(status)
		console.log(content)
		if (status == 200 && content) {
			const decodedToken: DecodedUserToken = jwtDecode(content.data)
			console.log(decodedToken)
			appData.client.token = content.data
			setAppData({
				token: content.data,
				client: appData.client,
				user: { ...decodedToken },
			})
			localStorage.setItem("token", content.data)
			navigate("/#home")
			return
		}
	}

	return (
		<Form onSubmit={login}>
			<Form.Group>
				<Form.Label>Email</Form.Label>
				<Form.Control name="email" type="email" />
			</Form.Group>
			<Form.Group>
				<Form.Label>Password</Form.Label>
				<Form.Control name="password" type="password" />
			</Form.Group>
			<Button variant="primary" type="submit">
				Login
			</Button>
		</Form>
	)
}
