import { Todo, User } from "../types/index.js";
import { store } from "../data/inMemoryStore.js";

export class TodoService {
	static getTodosForUser(user: User): Todo[] {
		return store.getTodosByUserId(user.id);
	}

	static getTodoById(id: string, user: User): Todo {
		const todo = store.getTodoById(id, user.id);
		if (!todo) {
			throw new Error("Todo not found");
		}
		return todo;
	}

	static createTodo(title: string, user: User): Todo {
		return store.createTodo(title, user.id);
	}

	static updateTodo(
		id: string,
		user: User,
		updates: Partial<Pick<Todo, "title" | "completed">>
	): Todo {
		const updatedTodo = store.updateTodo(id, user.id, updates);
		if (!updatedTodo) {
			throw new Error("Todo not found");
		}
		return updatedTodo;
	}

	static deleteTodo(id: string, user: User): boolean {
		const deleted = store.deleteTodo(id, user.id);
		if (!deleted) {
			throw new Error("Todo not found");
		}
		return true;
	}
}
