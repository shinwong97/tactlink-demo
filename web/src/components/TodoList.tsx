import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_TODOS,
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
} from '../graphql/queries'
import { useAuth } from '../contexts/AuthContext'

interface Todo {
  id: string
  title: string
  completed: boolean
  userId: string
}

const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const { user, logout } = useAuth()

  const { loading, error, data, refetch } = useQuery(GET_TODOS)
  const [createTodo] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      refetch()
      setNewTodo('')
    },
  })
  const [updateTodo] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      refetch()
      setEditingId(null)
      setEditingTitle('')
    },
  })
  const [deleteTodo] = useMutation(DELETE_TODO, {
    onCompleted: () => refetch(),
  })

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      await createTodo({ variables: { title: newTodo.trim() } })
    } catch (err) {
      console.error('Error creating todo:', err)
    }
  }

  const handleUpdateTodo = async (id: string) => {
    if (!editingTitle.trim()) return

    try {
      await updateTodo({ variables: { id, title: editingTitle.trim() } })
    } catch (err) {
      console.error('Error updating todo:', err)
    }
  }

  const handleToggleTodo = async (todo: Todo) => {
    try {
      await updateTodo({
        variables: { id: todo.id, completed: !todo.completed },
      })
    } catch (err) {
      console.error('Error toggling todo:', err)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo({ variables: { id } })
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your todos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-semibold mb-2">Error loading todos</h3>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  const todos = data?.todos || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Todo List</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Todo Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleCreateTodo} className="flex gap-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <button
              type="submit"
              disabled={!newTodo.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Todo
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No todos yet
              </h3>
              <p className="text-gray-600">
                Add your first todo to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {todos.map((todo: Todo) => (
                <div
                  key={todo.id}
                  className="p-6 hover:bg-gray-50 transition duration-200"
                >
                  {editingId === todo.id ? (
                    <div className="flex items-center gap-4">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleUpdateTodo(todo.id)
                        }
                      />
                      <button
                        onClick={() => handleUpdateTodo(todo.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span
                        className={`flex-1 text-lg ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-900'
                        }`}
                      >
                        {todo.title}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(todo)}
                          className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            {todos.filter((todo: Todo) => todo.completed).length} of{' '}
            {todos.length} completed
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoList
