import { User, AuthPayload } from "../types/index.js";
import { store } from "../data/inMemoryStore.js";

export class AuthService {
	static signup(email: string, password: string): AuthPayload {
		const existingUser = store.getUserByEmail(email);
		if (existingUser) {
			throw new Error("User already exists");
		}

		const user = store.createUser(email, password);
		const token = this.generateToken(user.id);

		return { token, user };
	}

	static login(email: string, password: string): AuthPayload {
		const user = store.getUserByEmail(email);
		if (!user || user.password !== password) {
			throw new Error("Invalid credentials");
		}

		const token = this.generateToken(user.id);
		return { token, user };
	}

	static validateToken(token: string): User | null {
		if (!token) return null;

		const userId = token.replace("token_", "");
		return store.getUserById(userId) || null;
	}

	private static generateToken(userId: string): string {
		return `token_${userId}`;
	}
}
