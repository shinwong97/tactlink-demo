import React from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginForm from './components/LoginForm'
import TodoList from './components/TodoList'

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <TodoList /> : <LoginForm />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
