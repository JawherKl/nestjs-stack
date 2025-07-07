# NestJS Stack Backend API

![Repository Size](https://img.shields.io/github/repo-size/JawherKl/nestjs-stack)
![Last Commit](https://img.shields.io/github/last-commit/JawherKl/nestjs-stack)
![Issues](https://img.shields.io/github/issues-raw/JawherKl/nestjs-stack)
![Forks](https://img.shields.io/github/forks/JawherKl/nestjs-stack)
![Stars](https://img.shields.io/github/stars/JawherKl/nestjs-stack)

<img src="images/nestJs+postgresql.png" alt="nestapi" width="340" height="180" />

> Enterprise-grade NestJS backend for managing developer projects, resources, secrets, and API keys with Keycloak authentication.

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

### Audit Logging
- [x] Track all critical actions (create/update/delete) for projects and resources
- [x] Store logs in a dedicated table
- [x] Expose an endpoint for admins to review logs

### Resource Sharing & Permissions
- [x] Allow project/resource sharing with other users
- [x] Implement granular permissions (read/write/admin) per resource/project

## 🏗️ Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Create database
psql -U postgres -c "CREATE DATABASE neststack_db;"

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
├── audit-log/              # Audit Logging
├── auth/                   # Authentication & authorization
├── dto/                    # Data transfer objects
├── keycloak/               # Keycloak implementation
├── prisma/                 # Database schema & migrations
├── project/                # Project management
├── project-permission/     # Project permission management
├── resource/               # Resource management
├── resource-permission/    # Resource premission management
└── user/                   # User informations management
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

### Audit Logging
- `GET /api/resources` - List all audit log

### Resource Sharing & Permissions
- `GET /projects/{projectId}/permissions` - List permissions releated to project
- `POST /projects/{projectId}/permissions` - Create permissions for project
- `GET /resources/{resourceId}/permissions` - List permissions releated to resource
- `POST /resources/{resourceId}/permissions` - Create permissions for resource

## 👤 Author

**Jawher Kallel**
- Github: [@JawherKl](https://github.com/JawherKl)

## 📄 License

This project is MIT licensed.
