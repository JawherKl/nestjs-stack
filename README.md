# NestJS Stack Backend API

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

> Enterprise-grade NestJS backend for managing developer resources, secrets, and API keys with Keycloak authentication.

## 🛠️ Tech Stack

- **Framework**: NestJS + Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Keycloak Integration
- **Docs**: OpenAPI/Swagger
- **Testing**: Jest + Supertest

## 🚀 Features

### Authentication & Authorization
- [x] Keycloak integration
- [x] JWT token validation
- [x] Role-based access control
- [x] User registration & login
- [x] Token refresh support

### Project Management
- [x] CRUD operations
- [x] Ownership validation
- [x] Soft delete functionality
- [x] Pagination & filtering
- [x] Search capabilities

### Resource Management
- [x] Secure secrets storage
- [x] API keys management
- [x] Project-based organization
- [x] Resource type validation
- [x] Archive/restore support

## 🏗️ Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev
```

## 🚀 Running the App

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:
```
http://localhost:3000/api/docs
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neststack"

# Keycloak
KEYCLOAK_AUTH_SERVER_URL="http://localhost:8080/auth"
KEYCLOAK_REALM="realm-name"
KEYCLOAK_CLIENT_ID="client-name"
KEYCLOAK_CLIENT_SECRET="your-client-secret"

# App
PORT=3000
NODE_ENV=development
```

## 📁 Project Structure

```
src/
├── auth/           # Authentication & authorization
├── project/        # Project management
├── resource/       # Resource management
├── prisma/         # Database schema & migrations
├── dto/            # Data transfer objects
└── config/         # Configuration files
```

## 🧪 Test Environment

```bash
# Create test database
psql -U postgres -c "CREATE DATABASE neststack_test;"

# Run tests with test environment
NODE_ENV=test npm run test
```

## 📝 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Project Routes
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Resource Routes
- `GET /api/resources` - List all resources
- `POST /api/resources` - Create resource
- `GET /api/resources/:id` - Get resource
- `DELETE /api/resources/:id` - Delete resource

## 👤 Author

**Jawher Kallel**
- Github: [@JawherKl](https://github.com/JawherKl)

## 📄 License

This project is MIT licensed.