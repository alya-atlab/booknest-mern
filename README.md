# BookNest

Full-stack MERN bookstore and e-commerce platform built with React, TypeScript, Node.js, Express, and MongoDB.

The project includes JWT authentication, role-based access control, cart and checkout workflows, inventory management, and order processing.

---

## Features

### Authentication & Authorization

- JWT authentication
- User registration and login
- Protected routes
- Role-based access control (user / author / admin)
- Persistent authentication using JWT
- Axios interceptor for authenticated requests

---

### Books

- Browse books catalog
- Pagination and filtering
- Get single book details
- Create books (author/admin)
- Update books with ownership validation
- Delete books with authorization checks
- Populate author information

---

### Cart

- Add books to cart
- Update cart items
- Remove cart items
- Protected cart routes
- Cart CRUD operations

---

### Orders & Checkout

- Checkout workflow
- Order creation
- Order retrieval with role-based access
- Order status updates
- Status transition validation
- Snapshot data integrity for ordered items

---

### Inventory

- Stock management
- Inventory validation
- Atomic stock updates
- Overselling prevention

---

### Frontend

- React + TypeScript frontend
- Login and register pages
- Reusable book card components
- Auth-aware navbar
- Loading and error handling states
- API integration using Axios

---

### Testing

- Jest integration testing
- Checkout success tests
- Checkout failure scenarios
- Access control tests
- Order status validation tests
- Transaction and inventory consistency tests

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- Material UI

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Testing

- Jest

---

## Project Structure

```txt
client/   → React frontend
server/   → Express backend and MongoDB logic
```

---

## API Endpoints

### Auth

```txt
POST /auth/register
POST /auth/login
```

### Users

```txt
GET /users
GET /users/:id
PUT /users/:id
```

### Books

```txt
GET /books
GET /books/:id
POST /books
PUT /books/:id
DELETE /books/:id
```

### Cart

```txt
GET /cart
POST /cart
PUT /cart/:bookId
DELETE /cart/:bookId
```

### Orders

```txt
POST /orders/checkout
GET /orders
GET /orders/:id
PATCH /orders/:id/status
```

---

## Authentication

Protected routes require a JWT token.

Example:

```txt
Authorization: Bearer <token>
```

---

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

### Frontend (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Architecture Notes

- Controller/service separation
- Centralized error handling with custom ApiError middleware
- JWT middleware for route protection
- Validation and authorization layers
- Reusable Axios instance with request interceptor
- Atomic inventory updates for stock consistency

---

## What I Learned

- Building JWT authentication and authorization flows
- Designing REST APIs with role-based access control
- Handling ownership validation and protected resources
- Managing inventory consistency during checkout
- Writing backend integration tests with Jest
- Structuring Express applications with separated layers

---

## Future Improvements

- Payment gateway integration
- Admin dashboard
- Search and sorting
- Book reviews and ratings
- Docker support
- CI/CD pipeline
- Redis caching