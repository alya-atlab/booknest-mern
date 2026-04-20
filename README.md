# BookNest

Full-stack MERN e-commerce platform for books with role-based access control (user, author, admin).

---

## Overview

BookNest is a full-stack application that demonstrates a complete e-commerce workflow using the MERN stack.

The backend is built with a clean and structured approach, including:

- JWT-based authentication
- Role-based authorization (user / author / admin)
- Separation of concerns (controllers / services)
- Input validation and centralized error handling

---

## Features

- JWT authentication
- Role-based access control (user / author / admin)
- Books catalog browsing
- Book management (author/admin)
- User management (admin / user)
- Input validation and error handling

---

## Tech Stack

- MongoDB
- Express.js
- React + TypeScript (Vite)
- Node.js
- Mongoose
- JWT Authentication

---

## Project Structure

```
client/   → React frontend
server/   → Express + MongoDB backend
```

---

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login

---

### Users

- GET /api/users
  → Admin only

- GET /api/users/:id
  → Admin or the user themselves

- PUT /api/users/:id
  → Admin or the user themselves

---

### Books

- GET /api/books

- POST /api/books
  → Author or Admin

- PUT /api/books/:id
  → Author (owner) or Admin

- DELETE /api/books/:id
  → Author (owner) or Admin

---

## Authentication

All protected routes require a JWT token.

Include the token in the request headers:

```
Authorization: Bearer <your_token>
```

---

## Example Request

### Update User

```
PUT /api/users/:id
```

Body:

```
{
  "firstName": "Alya",
  "email": "alya@example.com"
}
```

---

## Setup

### Backend

```
cd server
npm install
npm run dev
```

---

### Frontend

```
cd client
npm install
npm run dev
```
