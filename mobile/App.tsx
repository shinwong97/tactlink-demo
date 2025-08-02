import React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { ApolloProvider } from '@apollo/client'
import { client } from './src/graphql/client'
import { AuthProvider } from './src/contexts/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return (
    <ApolloProvider client={client}>
      <PaperProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PaperProvider>
    </ApolloProvider>
  )
}
