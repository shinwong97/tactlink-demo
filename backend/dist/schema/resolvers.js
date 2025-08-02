import { AuthService } from "../services/authService.js";
import { TodoService } from "../services/todoService.js";
export const resolvers = {
    Query: {
        me: (_, __, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return context.user;
        },
        todos: (_, __, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return TodoService.getTodosForUser(context.user);
        },
        todo: (_, { id }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return TodoService.getTodoById(id, context.user);
        },
    },
    Mutation: {
        signup: (_, { email, password }) => {
            return AuthService.signup(email, password);
        },
        login: (_, { email, password }) => {
            return AuthService.login(email, password);
        },
        createTodo: (_, { title }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return TodoService.createTodo(title, context.user);
        },
        updateTodo: (_, { id, title, completed, }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return TodoService.updateTodo(id, context.user, { title, completed });
        },
        deleteTodo: (_, { id }, context) => {
            if (!context.user) {
                throw new Error("Not authenticated");
            }
            return TodoService.deleteTodo(id, context.user);
        },
    },
};
