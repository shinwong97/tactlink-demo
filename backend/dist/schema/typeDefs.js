import { gql } from "graphql-tag";
export const typeDefs = gql `
	type User {
		id: ID!
		email: String!
		password: String!
	}

	type Todo {
		id: ID!
		title: String!
		completed: Boolean!
		userId: ID!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	type Query {
		me: User
		todos: [Todo!]!
		todo(id: ID!): Todo
	}

	type Mutation {
		signup(email: String!, password: String!): AuthPayload!
		login(email: String!, password: String!): AuthPayload!
		createTodo(title: String!): Todo!
		updateTodo(id: ID!, title: String, completed: Boolean): Todo!
		deleteTodo(id: ID!): Boolean!
	}
`;
