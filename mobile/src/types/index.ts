export interface User {
	id: string;
	email: string;
}

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	userId: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (token: string, user: User) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	isLoading: boolean;
	forceLogout: () => void;
}

export interface LoginScreenProps {
	navigation: any;
}

export interface TodoListScreenProps {
	navigation: any;
}
