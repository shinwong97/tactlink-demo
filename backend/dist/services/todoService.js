import { store } from "../data/inMemoryStore.js";
export class TodoService {
    static getTodosForUser(user) {
        return store.getTodosByUserId(user.id);
    }
    static getTodoById(id, user) {
        const todo = store.getTodoById(id, user.id);
        if (!todo) {
            throw new Error("Todo not found");
        }
        return todo;
    }
    static createTodo(title, user) {
        return store.createTodo(title, user.id);
    }
    static updateTodo(id, user, updates) {
        const updatedTodo = store.updateTodo(id, user.id, updates);
        if (!updatedTodo) {
            throw new Error("Todo not found");
        }
        return updatedTodo;
    }
    static deleteTodo(id, user) {
        const deleted = store.deleteTodo(id, user.id);
        if (!deleted) {
            throw new Error("Todo not found");
        }
        return true;
    }
}
