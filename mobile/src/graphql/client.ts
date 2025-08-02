import {
	ApolloClient,
	InMemoryCache,
	createHttpLink,
	from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the http link
// use ngrok or localtunnel to get a https link to the backend
const httpLink = createHttpLink({
	uri: "https://dd807329cb7d.ngrok-free.app/graphql",
});

// Add auth token to requests
const authLink = setContext(async (_, { headers }) => {
	// Get the authentication token from AsyncStorage
	let token = null;
	try {
		token = await AsyncStorage.getItem("token");
	} catch (error) {
		console.error("Error getting token from AsyncStorage:", error);
	}

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

// Error handling link for 401 responses
const errorLink = onError(
	({ graphQLErrors, networkError, operation, forward }) => {
		if (graphQLErrors) {
			graphQLErrors.forEach(({ message, locations, path, extensions }) => {
				// Check if it's an authentication error
				if (
					extensions?.code === "UNAUTHENTICATED" ||
					message.includes("Unauthorized") ||
					message.includes("Not authenticated")
				) {
					console.log("Authentication error detected, logging out user");
					// Clear stored auth data
					AsyncStorage.removeItem("token");
					AsyncStorage.removeItem("user");
					// You can also trigger a logout event here if needed
				}
			});
		}

		if (networkError) {
			// Handle network errors (including 401)
			if ("statusCode" in networkError && networkError.statusCode === 401) {
				console.log("401 Network error detected, logging out user");
				// Clear stored auth data
				AsyncStorage.removeItem("token");
				AsyncStorage.removeItem("user");
			}
		}
	}
);

// Create Apollo Client
export const client = new ApolloClient({
	link: from([errorLink, authLink, httpLink]),
	cache: new InMemoryCache(),
});
