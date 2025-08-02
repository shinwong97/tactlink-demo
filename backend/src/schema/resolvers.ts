import { Context } from "../types/index.js";
import { AuthService } from "../services/authService.js";
import { TodoService } from "../services/todoService.js";

export const resolvers = {
	Query: {
		me: (_: any, __: any, context: Context) => {
			if (!context.user) {
				throw new Error("Not authenticated");
			}
			return context.user;
		},
		todos: (_: any, __: any, context: Context) => {
			if (!context.user) {
				throw new Error("Not authenticated");
			}
			return TodoService.getTodosForUser(context.user);
		},
		todo: (_: any, { id }: { id: string }, context: Context) => {
			if (!context.user) {
				throw new Error("Not authenticated");
			}
			return TodoService.getTodoById(id, context.user);
		},
	},
	Mutation: {
		signup: (
			_: any,
			{ email, password }: { email: string; password: string }
		) => {
			return AuthService.signup(email, password);
		},
		login: (
			_: any,
			{ email, password }: { email: string; password: string }
		) => {
			return AuthService.login(email, password);
		},
		createTodo: (_: any, { title }: { title: string }, context: Context) => {
			if (!context.user) {
				throw new Error("Not authenticated");
			}
			return TodoService.createTodo(title, context.user);
		},
		updateTodo: (
			_: any,
			{
				id,
				title,
				completed,
			}: { id: string; title?: string; completed?: boolean },
			context: Context
		) => {
			if (!context.user) {
				throw new Error("Not authenticated");
			}
			return TodoService.updateTodo(id, context.user, { title, completed });
		},
		deleteTodo: (_: any, { id }: { id: string }, context: Context) => {
			if (!context.user) {
				throw new Error("Not authenticated");
			}
			return TodoService.deleteTodo(id, context.user);
		},
	},
};
