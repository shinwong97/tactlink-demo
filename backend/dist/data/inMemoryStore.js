class InMemoryStore {
    users = [];
    todos = [];
    nextUserId = 1;
    nextTodoId = 1;
    // User methods
    getAllUsers() {
        return [...this.users];
    }
    getUserById(id) {
        return this.users.find((user) => user.id === id);
    }
    getUserByEmail(email) {
        return this.users.find((user) => user.email === email);
    }
    createUser(email, password) {
        const user = {
            id: this.nextUserId.toString(),
            email,
            password,
        };
        this.users.push(user);
        this.nextUserId++;
        return user;
    }
    // Todo methods
    getAllTodos() {
        return [...this.todos];
    }
    getTodosByUserId(userId) {
        return this.todos.filter((todo) => todo.userId === userId);
    }
    getTodoById(id, userId) {
        return this.todos.find((todo) => todo.id === id && todo.userId === userId);
    }
    createTodo(title, userId) {
        const todo = {
            id: this.nextTodoId.toString(),
            title,
            completed: false,
            userId,
        };
        this.todos.push(todo);
        this.nextTodoId++;
        return todo;
    }
    updateTodo(id, userId, updates) {
        const todoIndex = this.todos.findIndex((todo) => todo.id === id && todo.userId === userId);
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
    deleteTodo(id, userId) {
        const todoIndex = this.todos.findIndex((todo) => todo.id === id && todo.userId === userId);
        if (todoIndex === -1) {
            return false;
        }
        this.todos.splice(todoIndex, 1);
        return true;
    }
}
export const store = new InMemoryStore();
