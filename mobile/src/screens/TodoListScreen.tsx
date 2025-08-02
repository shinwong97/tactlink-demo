import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'
import { Card, Chip } from 'react-native-paper'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_TODOS,
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
} from '../graphql/queries'
import { useAuth } from '../contexts/AuthContext'
import { TodoListScreenProps, Todo } from '../types'

const TodoListScreen: React.FC<TodoListScreenProps> = ({ navigation }) => {
  const [newTodo, setNewTodo] = useState('')
  const { user, logout } = useAuth()

  // GraphQL Queries and Mutations
  const { loading, error, data, refetch } = useQuery(GET_TODOS)
  const [createTodo] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      refetch()
      setNewTodo('')
    },
  })
  const [updateTodo] = useMutation(UPDATE_TODO, {
    onCompleted: () => refetch(),
  })
  const [deleteTodo] = useMutation(DELETE_TODO, {
    onCompleted: () => refetch(),
  })

  const addTodo = async () => {
    if (!newTodo.trim()) return

    try {
      await createTodo({ variables: { title: newTodo.trim() } })
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create todo')
    }
  }

  const toggleTodo = async (todo: any) => {
    try {
      await updateTodo({
        variables: { id: todo.id, completed: !todo.completed },
      })
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update todo')
    }
  }

  const handleDeleteTodo = async (id: string) => {
    Alert.alert('Delete Todo', 'Are you sure you want to delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTodo({ variables: { id } })
          } catch (err) {
            Alert.alert('Error', err.message || 'Failed to delete todo')
          }
        },
      },
    ])
  }

  const handleLogout = async () => {
    await logout()
    navigation.navigate('Login')
  }

  const todos = data?.todos || []
  const completedCount = todos?.filter((todo: any) => todo.completed).length

  const renderTodo = ({ item }: any) => (
    <Card style={[styles.todoCard, item.completed && styles.completedTodoCard]}>
      <Card.Content style={styles.todoCardContent}>
        <View style={styles.todoRow}>
          <TouchableOpacity
            style={styles.todoContent}
            onPress={() => toggleTodo(item)}
          >
            <View style={styles.checkboxContainer}>
              {item.completed ? (
                <View style={styles.checkedBox}>
                  <MaterialIcons name="check" size={16} color="white" />
                </View>
              ) : (
                <View style={styles.uncheckedBox} />
              )}
            </View>
            <Text
              style={[
                styles.todoText,
                item.completed && styles.completedTodoText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTodo(item.id)}
          >
            <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  )

  if (loading) {
    return (
      <View style={styles.gradientContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading your todos...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    // Check if it's an authentication error
    const isAuthError =
      error.message.includes('Unauthorized') ||
      error.message.includes('UNAUTHENTICATED') ||
      error.message.includes('Not authenticated') ||
      error.message.includes('401')

    if (isAuthError) {
      return (
        <View style={styles.gradientContainer}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="lock-outline" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Authentication Required</Text>
            <Text style={styles.errorMessage}>
              Your session has expired. Please log in again.
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.retryButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.gradientContainer}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Error loading todos</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.gradientContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>My Todo List</Text>
              <Text style={styles.headerSubtitle}>
                Welcome back, {user?.email || 'User'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        {todos.length > 0 && (
          <View style={styles.statsContainer}>
            <Chip icon="check-circle" style={styles.statsChip}>
              {completedCount} of {todos.length} completed
            </Chip>
          </View>
        )}

        {/* Add Todo Form */}
        <Card
          style={[
            styles.addTodoCard,
            todos.length === 0 && styles.addTodoCardEmpty,
          ]}
        >
          <Card.Content style={styles.addTodoContent}>
            <View style={styles.addTodoInputContainer}>
              <TextInput
                style={styles.addTodoInput}
                placeholder="What needs to be done?"
                value={newTodo}
                onChangeText={setNewTodo}
                onSubmitEditing={addTodo}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity
                style={[
                  styles.addButton,
                  !newTodo.trim() && styles.addButtonDisabled,
                ]}
                onPress={addTodo}
                disabled={!newTodo.trim()}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Todo List */}
        <View style={styles.todoListContainer}>
          {todos.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyTitle}>No todos yet</Text>
                <Text style={styles.emptySubtitle}>
                  Add your first todo to get started!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            <FlatList
              data={todos}
              renderItem={renderTodo}
              keyExtractor={(item) => item.id}
              style={styles.todoList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.todoListContent}
            />
          )}
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  )
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    backgroundColor: '#EBF4FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
  },
  statsContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  statsChip: {
    alignSelf: 'center',
    backgroundColor: '#E0F2FE',
  },
  addTodoCard: {
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
  },
  addTodoCardEmpty: {
    marginTop: 40,
  },
  addTodoContent: {
    padding: 16,
  },
  addTodoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addTodoInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  todoListContainer: {
    flex: 1,
  },
  todoList: {
    flex: 1,
  },
  todoListContent: {
    paddingBottom: 20,
  },
  todoCard: {
    marginBottom: 12,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTodoCard: {
    backgroundColor: '#F9FAFB',
  },
  todoCardContent: {
    padding: 16,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkedBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
  },
  emptyCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'white',
  },
  emptyContent: {
    padding: 20,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default TodoListScreen
