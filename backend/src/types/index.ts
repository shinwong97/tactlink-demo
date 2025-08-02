export interface User {
	id: string;
	email: string;
	password: string;
}

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	userId: string;
}

export interface AuthPayload {
	token: string;
	user: User;
}

export interface Context {
	user: User | null;
}
