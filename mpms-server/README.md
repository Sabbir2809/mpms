# MPMS — Minimal Project Management System

## 📌 Features

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Hashing:** bcryptjs
- **Validation:** Zod
- **Rate Limiting:** express-rate-limit

## ⚙️ Getting Started

### ✅ Prerequisites

- Node.js v20
- npm or yarn
- MongoDB (local or MongoDB Atlas)

---

### 📦 Installation

```bash
# Clone repository
git clone https://github.com/Sabbir2809/mpms.git

# Navigate to project
cd server

# Install dependencies
npm install
```

---

### 🔐 Environment Variables

Create environment file:

```bash
cp .env.example .env
```

---

### ▶️ Running the Server

#### Development

```bash
npm run dev
```

#### Production

```bash
npm run build
npm start
```

Server runs on:

```
http://localhost:5000/api/health
```

## 📦 Response Format

All API responses follow:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": {}
}
```

## ⚠️ Error Handling

The API uses a centralized error handling system with consistent error responses:

- Validation errors
- Authentication errors
- Not found errors
- Server errors

```ts
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "error": {
    "details": "Additional error details"
  }
}
```

## 🔒 Security

- bcrypt password hashing
- JWT authentication
- Role-based authorization
- Rate limiting
- Request validation
- Duplicate application prevention
- CORS protection

---

# 📜 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build project
npm start        # Run production server
npm run seed     # Seed sample data
```
