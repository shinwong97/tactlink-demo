import { User, Todo } from "../types/index.js";

class InMemoryStore {
	private users: User[] = [];
	private todos: Todo[] = [];
	private nextUserId = 1;
	private nextTodoId = 1;

	// User methods
	getAllUsers(): User[] {
		return [...this.users];
	}

	getUserById(id: string): User | undefined {
		return this.users.find((user) => user.id === id);
	}

	getUserByEmail(email: string): User | undefined {
		return this.users.find((user) => user.email === email);
	}

	createUser(email: string, password: string): User {
		const user: User = {
			id: this.nextUserId.toString(),
			email,
			password,
		};
		this.users.push(user);
		this.nextUserId++;
		return user;
	}

	// Todo methods
	getAllTodos(): Todo[] {
		return [...this.todos];
	}

	getTodosByUserId(userId: string): Todo[] {
		return this.todos.filter((todo) => todo.userId === userId);
	}

	getTodoById(id: string, userId: string): Todo | undefined {
		return this.todos.find((todo) => todo.id === id && todo.userId === userId);
	}

	createTodo(title: string, userId: string): Todo {
		const todo: Todo = {
			id: this.nextTodoId.toString(),
			title,
			completed: false,
			userId,
		};
		this.todos.push(todo);
		this.nextTodoId++;
		return todo;
	}

	updateTodo(
		id: string,
		userId: string,
		updates: Partial<Pick<Todo, "title" | "completed">>
	): Todo | null {
		const todoIndex = this.todos.findIndex(
			(todo) => todo.id === id && todo.userId === userId
		);
		if (todoIndex === -1) {
			return null;
		}

		if (updates.title !== undefined) {
			this.todos[todoIndex].title = updates.title;
		}
		if (updates.completed !== undefined) {
			this.todos[todoIndex].completed = updates.completed;
		}

		return this.todos[todoIndex];
	}

	deleteTodo(id: string, userId: string): boolean {
		const todoIndex = this.todos.findIndex(
			(todo) => todo.id === id && todo.userId === userId
		);
		if (todoIndex === -1) {
			return false;
		}

		this.todos.splice(todoIndex, 1);
		return true;
	}
}

export const store = new InMemoryStore();
