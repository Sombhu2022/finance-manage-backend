# Zorvyn Finance App

A robust, modular, and versioned finance application backend built with Node.js, Express, TypeScript, and Drizzle ORM.

## 🛠️ Tech Stack & Tools

### Core Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ESM enabled)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Powered by [Neon Serverless](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Validation**: [Zod](https://zod.dev/) (Schema-based runtime validation)

### Documentation & Security
- **API Docs**: [Swagger (OpenAPI 3.0)](https://swagger.io/) via `swagger-jsdoc` & `swagger-ui-express`
- **Security**: [Helmet](https://helmetjs.github.io/), `express-rate-limit`, and [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Auth**: [JSON Web Token (JWT)](https://jwt.io/) & OTP (via [Nodemailer](https://nodemailer.com/))

### Development & DevOps
- **Testing**: [Jest](https://jestjs.io/) with specialized Mocking for ESM (`jest.unstable_mockModule`)
- **Linting**: [ESLint](https://eslint.org/) (Strict rules for code quality)
- **Formatting**: [Prettier](https://prettier.io/) (Consistent code style)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/lint-staged/lint-staged) (Enforcing quality on every commit)
- **Hot Reload**: [tsx](https://github.com/privatenumber/tsx) & [Nodemon](https://nodemon.io/)

---

## 🏗️ Architecture Overview

The project follows a **Modular Architecture** with **Layered Responsibility**, designed for scalability and maintainable growth. 

### 1. Modular Monolith
The codebase is organized by business domains (e.g., Auth, Finance, users, Dashboard). Each module is self-contained, encapsulating its own routes, controllers, services, models, and tests.

### 2. API Versioning
Each module supports side-by-side versioning (e.g., `v1`, `v2`). This allows for breaking changes in future versions without affecting existing clients.
- Physical path: `src/modules/{module_name}/{version}/`
- API path: `/api/{version}/{module_name}/`

### 3. Layered Responsibility
Within each module version, we maintain a clear separation of concerns:
- **Routes**: Define endpoints and apply middlewares (auth, validation).
- **Controllers**: Handle HTTP requests, parse inputs, and return responses.
- **Services**: Contain the core business logic and database interactions.
- **Models**: Define the database schemas using Drizzle ORM.
- **Validations**: Use Zod schemas to enforce strict request body validation.

---

## 📁 Folder Structure

```text
src/
├── core/                # Centralized application logic
│   ├── api/             # API version aggregators (v1, v2)
│   ├── config/          # Configuration (env, logger)
│   ├── database/        # Database initialization & Drizzle setup
│   ├── docs/            # Swagger/OpenAPI documentation
│   └── app.ts           # Express app instance
├── modules/             # Business domain modules
│   ├── auth/v1/         # Authentication logic (v1)
│   │   ├── __tests__/   # Integration tests
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   ...
│   ├── dashboard/v1/    # Dashboard & analytics (v1)
│   ├── finance/v1/      # Transaction & finance management (v1)
│   └── users/v1/        # user management & profile (v1)
├── shared/              # Reusable cross-module components
│   ├── constants/       # Global Enums & Constants
│   ├── middlewares/     # Reusable middlewares (auth, rbac, errors)
│   ├── services/        # Common services (email, third-party APIs)
│   ├── types/           # Shared TypeScript interfaces
│   └── utils/           # Utility functions (security, db-migrate)
└── main.ts              # Entry point
```

---

## ✨ Features & Advantages

### Features
- **Secure Authentication**: JWT-based auth with a two-step verification flow (OTP).
- **Role-Based Access Control (RBAC)**: Specific access levels for `ADMIN`, `ANALYST`, and `VIEWER`.
- **Database Migrations**: Automated neon-serverless database migrations.
- **Advanced Filtering**: Transactions can be filtered by date, type, category, and sorted dynamically.
- **Swagger Documentation**: Self-documenting API via Swagger UI.

### Advantages
- **Maintainability**: Clear folder structure makes it easy to find and update files.
- **Stability**: Full integration test coverage for all modules using Jest.
- **Type Safety**: End-to-end TypeScript ensures compile-time errors instead of runtime crashes.
- **Scalability**: New modules or API versions can be added without bloating existing code.

---

## 🚀 Best Coding Practices

To maintain code quality in this architecture, follow these principles:

1. **Layer Integrity**:
    - Never write database logic in Controllers. Move it to Services.
    - Never write HTTP-specific logic (like `res.json()`) in Services. Keep it in Controllers.
2. **Schema-First Validation**:
    - Always define a `Zod` schema for incoming requests and validate them in the route layer using the Controller's validation methods.
3. **Consistent Error Handling**:
    - Use the `AppError` class for all expected errors.
    - Wrap controller methods in `asyncHandler` to avoid repetitive try-catch blocks.
4. **ESM Compliance**:
    - Always include the `.js` extension in relative imports.
    - Use `jest.unstable_mockModule` for mocking dependencies in tests.
5. **DRY (Don't Repeat Yourself)**:
    - Put common logic (like date formatting or permission checks) in the `shared/` directory.

---

## 🛠️ Getting Started

1. **Install Dependencies**: `npm install`
2. **Setup Env**: Copy `.env.example` to `.env` and fill in NEON database details.
3. **Run Dev**: `npm run dev`
4. **Run Tests**: `npm run test`
5. **Lint & Format**: `npm run lint` / `npm run format`

---

## 📄 API Documentation
For detailed endpoint specifications, see **[API_DOCS.md](./API_DOCS.md)**.
Documentation is also available at `/api-docs` when the server is running.
# finance-manage-backend
