import { gql } from "@apollo/client";

// Authentication mutations
export const LOGIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				email
			}
		}
	}
`;

export const SIGNUP_MUTATION = gql`
	mutation Signup($email: String!, $password: String!) {
		signup(email: $email, password: $password) {
			token
			user {
				id
				email
			}
		}
	}
`;

// Todo queries and mutations
export const GET_TODOS = gql`
	query GetTodos {
		todos {
			id
			title
			completed
			userId
		}
	}
`;

export const CREATE_TODO = gql`
	mutation CreateTodo($title: String!) {
		createTodo(title: $title) {
			id
			title
			completed
			userId
		}
	}
`;

export const UPDATE_TODO = gql`
	mutation UpdateTodo($id: ID!, $title: String, $completed: Boolean) {
		updateTodo(id: $id, title: $title, completed: $completed) {
			id
			title
			completed
			userId
		}
	}
`;

export const DELETE_TODO = gql`
	mutation DeleteTodo($id: ID!) {
		deleteTodo(id: $id)
	}
`;
