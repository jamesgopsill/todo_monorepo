import { useContext, useEffect, useState } from "react"
import { Button, Card, FloatingLabel, Form } from "react-bootstrap"
import { ToDo } from "types"
import { AppContext } from "../AppContext"

export function HomePage() {
	const { appData } = useContext(AppContext)
	const [todo, setToDo] = useState<ToDo[]>([])

	const postTodo = async (event: any) => {
		event.preventDefault()
		console.log("button pressed")
		const { status } = await appData.client.todo.post({
			text: event.target.todo.value,
		})
		if (status !== 200) {
			alert("Whoops something went wrong")
			return
		}
		getTodos()
	}

	const removeTodo = async (id: string) => {
		const { status } = await appData.client.todo.remove(id)
		if (status !== 200) {
			alert("Whoops something went wrong")
			return
		}
		getTodos()
	}

	const getTodos = async () => {
		const { status, content } = await appData.client.todo.get()
		if (status == 200) {
			setToDo(content.data)
		}
	}

	const listTodos = () => {
		const list = []
		for (const t of todo) {
			list.push(
				<Card key={t.id}>
					<Card.Body>
						<Card.Text>{t.text}</Card.Text>
						<Button variant="danger" onClick={() => removeTodo(t.id)}>
							Remove
						</Button>
					</Card.Body>
				</Card>,
			)
		}
		if (list.length > 0) {
			return list
		}
		return <p>No Todos Here</p>
	}

	useEffect(() => {
		getTodos()
	}, [])

	return (
		<>
			<Form onSubmit={postTodo}>
				<FloatingLabel label="Todo" className="mb-3">
					<Form.Control name="todo" as="textarea" />
				</FloatingLabel>
				<Button variant="primary" type="submit">
					Post
				</Button>
			</Form>
			<hr />
			{listTodos()}
		</>
	)
}
