# API Documentation - Version v1

This document specifies the endpoints, request/response formats, and headers for the Zorvyn Finance API (v1).

## 🔐 Authentication

All protected endpoints require a **Bearer Token** in the `Authorization` header.

```text
Authorization: Bearer <your_jwt_token>
```

---

## 🛠️ Auth Module

### 1. Register User
- **Endpoint**: `POST /api/v1/auth/register`
- **Description**: Registers a new user and sends a 6-digit verification code to the email.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response (201)**:
  ```json
  {
    "status": "success",
    "message": "Registration successful. Please verify your email.",
    "data": { "id": "...", "email": "..." }
  }
  ```

### 2. Login User
- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Authenticates a user and starts the tracking session.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response (200)**:
  ```json
  {
    "status": "success",
    "token": "...",
    "data": { "user": { "id": "...", "email": "..." } }
  }
  ```

### 3. Verify OTP
- **Endpoint**: `POST /api/v1/auth/verify-otp`
- **Description**: Verifies the email using the 6-digit code.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Response (200)**:
  ```json
  {
    "status": "success",
    "message": "Email verified successfully.",
    "token": "...",
    "data": { "user": { "id": "...", "email": "..." } }
  }
  ```

### 4. Resend OTP
- **Endpoint**: `POST /api/v1/auth/resend-otp`
- **Description**: Generates and sends a new OTP code.
- **Request Body**:
  ```json
  { "email": "user@example.com" }
  ```
- **Response (200)**:
  ```json
  { "status": "success", "message": "A new verification code has been sent." }
  ```

---

## 💸 Finance Module

### 1. List Transactions (Protected)
- **Endpoint**: `GET /api/v1/finance`
- **Description**: Retrieves transactions for the authenticated user with optional filtering.
- **Query Params**: `category`, `type`, `startDate`, `endDate`, `sortBy`, `order`.
- **Response (200)**:
  ```json
  {
    "status": "success",
    "data": { "transactions": [...] }
  }
  ```

### 2. Create Transaction (Protected)
- **Endpoint**: `POST /api/v1/finance`
- **Description**: Records a new transaction (income/expense).
- **Request Body**:
  ```json
  {
    "amount": 1500,
    "type": "INCOME",
    "category": "Salary",
    "description": "Monthly pay",
    "date": "2023-10-01"
  }
  ```
- **Response (201)**:
  ```json
  { "status": "success", "data": { "transaction": { "id": "...", ... } } }
  ```

### 3. Delete Transaction (Admin Only)
- **Endpoint**: `DELETE /api/v1/finance/:id`
- **Description**: Permanently removes a transaction.
- **Response (200)**:
  ```json
  { "status": "success", "message": "Transaction deleted successfully" }
  ```

---

## 👥 Users Module

### 1. Get All Users (Admin/Analyst Only)
- **Endpoint**: `GET /api/v1/users`
- **Description**: Lists all registered users in the system.
- **Response (200)**:
  ```json
  { "status": "success", "data": { "users": [...] } }
  ```

### 2. Update user Role (Admin Only)
- **Endpoint**: `PATCH /api/v1/users/:id`
- **Description**: Changes the role of a user.
- **Request Body**:
  ```json
  { "role": "ADMIN" }
  ```
- **Response (200)**:
  ```json
  { "status": "success", "data": { "user": { ... } } }
  ```

---

## 📊 Dashboard Module

### 1. Summary Statistics (Protected)
- **Endpoint**: `GET /api/v1/dashboard/summary`
- **Description**: Returns quick totals for income, expense, and balance.
- **Response (200)**:
  ```json
  {
    "status": "success",
    "data": {
      "totalIncome": 2500,
      "totalExpense": 800,
      "balance": 1700
    }
  }
  ```

---

## 🛑 Error Responses

All errors follow this unified structure:

```json
{
  "status": "error",
  "message": "Clear description of what went wrong",
  "timestamp": "2023-10-01T12:00:00Z"
}
```

- **400**: Bad Request (validation failure).
- **401**: Unauthorized (missing/invalid token).
- **403**: Forbidden (insufficient permissions).
- **404**: Not Found (resource does not exist).
- **500**: Internal Server Error (database or unexpected logic).
