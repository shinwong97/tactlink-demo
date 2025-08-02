import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import { AuthService } from "./services/authService.js";
import { Context } from "./types/index.js";

// Context function to handle authentication
const context = async ({ req }: { req: any }): Promise<Context> => {
	const token = req.headers.authorization?.replace("Bearer ", "");
	if (token) {
		const user = AuthService.validateToken(token);
		return { user };
	}
	return { user: null };
};

// Create and start the server
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context,
});

console.log(`🚀 Server ready at: ${url}`);
