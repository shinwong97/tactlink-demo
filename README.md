# TactLink - Full Stack Todo Application

A complete full-stack todo application with GraphQL backend, React web app, and React Native mobile app.

## 🏗️ Architecture

- **Backend**: Node.js + TypeScript + Apollo GraphQL Server
- **Web App**: React + TypeScript + Vite + Tailwind CSS
- **Mobile App**: React Native + Expo + TypeScript
- **Data Storage**: In-memory storage (for demo purposes)
- **Authentication**: JWT-based authentication

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

### Required Software

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### For Mobile Development

- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Expo Go App** - Download on your mobile device from App Store/Google Play

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd tactlink
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm start
```

The GraphQL server will start on `http://localhost:4000`

**Available Scripts:**

- `npm start` - Compile TypeScript and start the server
- `npm run compile` - Compile TypeScript only

### 3. Web App Setup

```bash
# Open a new terminal and navigate to web directory
cd web

# Install dependencies
npm install

# Start the development server
npm run dev
```

The web app will start on `http://localhost:3000`

**Available Scripts:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### 4. Mobile App Setup

```bash
# Open a new terminal and navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

This will open the Expo development tools in your browser. You can:

- Scan the QR code with Expo Go app on your phone
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator (macOS only)

**Available Scripts:**

- `npm start` - Start Expo development server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS (macOS only)
- `npm run web` - Start web version

## 🔧 Configuration

### Backend Configuration

The backend uses in-memory storage by default. No additional configuration is required for local development.

**Environment Variables** (optional):

```bash
NODE_ENV=development
PORT=4000
```

### Web App Configuration

The web app is configured to connect to the local GraphQL server at `http://localhost:4000/graphql`.

### Mobile App Configuration

**Important**: The mobile app currently points to a remote GraphQL server. To use your local backend:

1. Update the GraphQL endpoint in `mobile/src/graphql/client.ts`:

```typescript
const httpLink = createHttpLink({
	uri: "http://localhost:4000/graphql", // Change this to your local server or use ngrok/localtunnel with https url
});
```

2. For testing on physical devices, you'll need to:
   - Use your computer's IP address instead of localhost
   - Or use a tool like ngrok to expose your local server

## 📱 Testing the Application

### 1. Backend Testing

Visit `http://localhost:4000` to access the GraphQL Playground where you can test queries and mutations.

**Sample GraphQL Queries:**

```graphql
# Login
mutation {
	login(email: "test@example.com", password: "password") {
		token
		user {
			id
			email
		}
	}
}

# Get Todos
query {
	todos {
		id
		title
		completed
		userId
	}
}

# Create Todo
mutation {
	createTodo(title: "Test Todo") {
		id
		title
		completed
	}
}
```

### 2. Web App Testing

1. Open `http://localhost:5173` in your browser
2. Sign up with a new account or login with existing credentials
3. Create, view, update, and delete todos

### 3. Mobile App Testing

1. Start the mobile app using Expo
2. Use Expo Go app to scan the QR code
3. Test the same functionality as the web app

## 🗂️ Project Structure

```
tactlink/
├── backend/                 # GraphQL Server
│   ├── src/
│   │   ├── data/           # In-memory data store
│   │   ├── models/         # Data models
│   │   ├── schema/         # GraphQL schema and resolvers
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   └── index.ts        # Server entry point
│   └── package.json
├── web/                    # React Web App
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── graphql/        # GraphQL queries
│   │   └── main.tsx        # App entry point
│   └── package.json
├── mobile/                 # React Native App
│   ├── src/
│   │   ├── contexts/       # React contexts
│   │   ├── graphql/        # GraphQL client and queries
│   │   ├── navigation/     # Navigation setup
│   │   ├── screens/        # App screens
│   │   └── types/          # TypeScript types
│   └── package.json
└── README.md
```

## 🔍 Features

### Authentication

- User registration and login
- JWT token-based authentication
- Protected routes and API endpoints

### Todo Management

- Create new todos
- View all todos (user-scoped)
- Mark todos as complete/incomplete
- Delete todos
- Real-time updates

### Cross-Platform

- Web app (React + Vite)
- Mobile app (React Native + Expo)
- Shared GraphQL API

## 🛠️ Development

### Adding New Features

1. **Backend Changes**:

   - Add new types in `backend/src/types/`
   - Update GraphQL schema in `backend/src/schema/typeDefs.ts`
   - Implement resolvers in `backend/src/schema/resolvers.ts`
   - Add business logic in `backend/src/services/`

2. **Web App Changes**:

   - Add new components in `web/src/components/`
   - Update GraphQL queries in `web/src/graphql/queries.ts`
   - Modify screens in `web/src/`

3. **Mobile App Changes**:
   - Add new screens in `mobile/src/screens/`
   - Update GraphQL queries in `mobile/src/graphql/queries.ts`
   - Modify navigation in `mobile/src/navigation/`

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (if configured)

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:

   ```bash
   # Kill process using port 4000
   lsof -ti:4000 | xargs kill -9
   ```

2. **Node Modules Issues**:

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Expo Issues**:

   ```bash
   # Clear Expo cache
   expo r -c

   # Reset Metro bundler
   expo start --clear
   ```

4. **Mobile App Can't Connect to Backend**:
   - Ensure backend is running on `localhost:4000`
   - For physical devices, use your computer's IP address
   - Check firewall settings

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Ensure all prerequisites are installed
3. Verify all services are running on correct ports
4. Check network connectivity for mobile app

## 📚 Additional Resources

- [Apollo GraphQL Documentation](https://www.apollographql.com/docs/)
- [React Documentation](https://react.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---
