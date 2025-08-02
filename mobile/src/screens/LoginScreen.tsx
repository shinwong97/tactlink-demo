import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'
import { Card } from 'react-native-paper'
import { useMutation } from '@apollo/client'
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/queries'
import { useAuth } from '../contexts/AuthContext'
import { LoginScreenProps } from '../types'

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const [loginMutation] = useMutation(LOGIN_MUTATION)
  const [signupMutation] = useMutation(SIGNUP_MUTATION)

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { data } = await loginMutation({
          variables: { email, password },
        })
        login(data.login.token, data.login.user)
        navigation.navigate('TodoList')
      } else {
        const { data } = await signupMutation({
          variables: { email, password },
        })
        login(data.signup.token, data.signup.user)
        navigation.navigate('TodoList')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
      Alert.alert('Error', err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.gradientContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="check-circle" size={60} color="#3B82F6" />
            </View>
            <Text style={styles.appTitle}>TactLink</Text>
            <Text style={styles.appSubtitle}>Task Management Made Simple</Text>
          </View>

          <Card style={styles.loginCard}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.welcomeTitle}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {isLogin
                  ? 'Sign in to your account'
                  : 'Get started with your free account'}
              </Text>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="email"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchModeButton}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.switchModeText}>
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : 'Already have an account? Sign in'}
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  loginCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchModeButton: {
    alignItems: 'center',
  },
  switchModeText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
})

export default LoginScreen
