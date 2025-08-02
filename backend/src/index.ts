import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/typeDefs.js";
import { resolvers } from "./schema/resolvers.js";
import { AuthService } from "./services/authService.js";
import { Context } from "./types/index.js";
import express from "express";

// Create Express app for health checks
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ 
		status: 'healthy', 
		timestamp: new Date().toISOString(),
		service: 'tactlink-graphql-backend'
	});
});

// Start Express server for health checks
const healthPort = 4001;
app.listen(healthPort, () => {
	console.log(`🏥 Health check server running on port ${healthPort}`);
});

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
	formatError: (error) => {
		// Log errors in production
		console.error('GraphQL Error:', error);
		return {
			message: error.message,
			extensions: {
				code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
			}
		};
	},
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context,
});

console.log(`🚀 GraphQL Server ready at: ${url}`);
console.log(`🏥 Health check available at: http://localhost:${healthPort}/health`);
