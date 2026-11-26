# Product Management System

A small full-stack application for managing a product catalogue: list, add, view, edit, delete and search products.
Built for the RedWolf InfoTech Full Stack Developer assignment.

## Features

- Product list in a table (cards on small screens) with name, category, price, quantity, created date and actions
- Add, view, edit and delete products (delete asks for confirmation)
- Search by product name: partial and case-insensitive, run against the database
- Validation in the browser and again on the server
- Loading, empty, error and success states; the search term is kept in the URL
- REST API with JSON responses and proper HTTP status codes
- Data persisted in MySQL, so it survives restarting the backend

## Tech stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, React Router, plain CSS, Lucide |
| Backend  | Node.js, Express 4, TypeScript, mysql2 (parameterised SQL)  |
| Database | MySQL 8.0.16 or newer                                       |

## Project structure

```
product-management-system/
├── client/                     React + Vite frontend
│   └── src/
│       ├── components/         Reusable UI (Button, ProductTable, ProductForm, dialogs, toasts...)
│       ├── pages/              Route-level screens (list, details, add/edit form)
│       ├── services/           API client (fetch wrapper + product calls)
│       ├── hooks/              useProduct, useDebouncedValue
│       ├── utils/              Form validation, formatting
│       ├── types/              Shared TypeScript types
│       └── styles/index.css    All styling and design tokens
├── server/                     Express API
│   └── src/
│       ├── config/             Environment variables and MySQL pool
│       ├── routes/             URL -> controller mapping
│       ├── controllers/        Request/response handling
│       ├── services/           SQL queries
│       ├── middleware/         Error handling, async wrapper
│       ├── utils/              Request validation
│       ├── errors/             ApiError (status code + message)
│       └── types/              Product types
├── database/
│   ├── schema.sql              Creates the database and products table
│   └── seed.sql                Optional sample data
```

## Prerequisites

- Node.js 20 or newer (LTS) and npm
- MySQL Server 8.0.16 or newer (MySQL Workbench is handy for running the SQL script)
- Git

## Setup

### 1. Database

Open `database/schema.sql` in MySQL Workbench and run the whole script. It creates the `product_management` database and the `products` table.
Optionally run `database/seed.sql` for sample products.

### 2. Backend

```bash
cd server
cp .env.example .env        # Windows Command Prompt: copy .env.example .env
# edit .env and set DB_PASSWORD (and DB_USER if you don't use root)
npm install
npm run dev
```

The API runs at `http://localhost:4000/api`. Check `http://localhost:4000/api/health`.

### 3. Frontend (second terminal)

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend expects the API at `http://localhost:4000/api`. If yours is elsewhere, copy `client/.env.example` to `client/.env` and change `VITE_API_BASE_URL`.

### Environment variables

`server/.env`

| Variable        | Purpose                                      | Default                                          |
| --------------- | -------------------------------------------- | ------------------------------------------------ |
| `PORT`          | API port                                     | `4000`                                           |
| `CLIENT_ORIGIN` | Allowed CORS origins (comma-separated)       | `http://localhost:5173,http://127.0.0.1:5173`    |
| `DB_HOST`       | MySQL host                                   | `localhost`                                      |
| `DB_PORT`       | MySQL port                                   | `3306`                                           |
| `DB_USER`       | MySQL user (required)                        |                                                  |
| `DB_PASSWORD`   | MySQL password                               | empty                                            |
| `DB_NAME`       | Database name (required)                     | `product_management` in `.env.example`           |

`client/.env` (optional): `VITE_API_BASE_URL`. Database credentials only ever live in the server's `.env`, which is git-ignored.

### Production build

```bash
cd server && npm run build && npm start
cd client && npm run build        # output in client/dist
```

## API documentation

Base URL: `http://localhost:4000/api`. All bodies are JSON.

| Method | Endpoint             | Description                                         | Success |
| ------ | -------------------- | --------------------------------------------------- | ------- |
| GET    | `/products`          | List products, newest first. Optional `?search=`    | 200     |
| GET    | `/products/:id`      | Get one product                                     | 200     |
| POST   | `/products`          | Create a product                                    | 201     |
| PUT    | `/products/:id`      | Replace a product's editable fields                 | 200     |
| DELETE | `/products/:id`      | Delete a product                                    | 204     |
| GET    | `/health`            | Liveness check                                      | 200     |

### Product object

```json
{
  "id": 7,
  "name": "Wireless Mouse",
  "description": "Ergonomic 2.4 GHz wireless mouse.",
  "price": 24.99,
  "quantity": 120,
  "category": "Accessories",
  "createdAt": "2026-11-25T10:15:30.000Z"
}
```

`description` and `category` may be `null`. `id` and `createdAt` are generated by the database.

### Examples

**GET /api/products?search=mouse** returns `200`:

```json
[
  {
    "id": 7,
    "name": "Wireless Mouse",
    "description": "Ergonomic 2.4 GHz wireless mouse.",
    "price": 24.99,
    "quantity": 120,
    "category": "Accessories",
    "createdAt": "2026-11-25T10:15:30.000Z"
  }
]
```

**POST /api/products**

```json
{
  "name": "Laptop Stand",
  "description": "Foldable aluminium stand.",
  "price": 34.0,
  "quantity": 72,
  "category": "Office"
}
```

returns `201` with the created product (including `id` and `createdAt`). **PUT /api/products/:id** takes the same body and returns `200` with the updated product.

**DELETE /api/products/:id** returns `204` with no body.

### Errors

Every error has the same shape:

```json
{ "error": { "message": "Validation failed", "details": { "price": "Price must not be negative" } } }
```

| Status | When                                                                         |
| ------ | ---------------------------------------------------------------------------- |
| 400    | Invalid body (`details` lists each field), invalid ID, or malformed JSON     |
| 404    | No product with that ID, or unknown route                                    |
| 500    | Unexpected failure such as the database being down (details are only logged) |

## Validation rules

| Field         | Rule                                                              |
| ------------- | ----------------------------------------------------------------- |
| `name`        | Required, not blank, at most 150 characters                       |
| `description` | Optional, at most 2000 characters                                 |
| `price`       | Required number, **not negative**, at most 2 decimal places       |
| `quantity`    | Required whole number, **not negative**                           |
| `category`    | Optional, at most 100 characters                                  |

The same rules are enforced in the form (`client/src/utils/productForm.ts`), in the API (`server/src/utils/productValidation.ts`) and by `CHECK` constraints in the database.

## Design decisions

- **Search runs on the backend** (`WHERE name LIKE ?`), so results always come from the database and the approach keeps working if the catalogue grows. The input is debounced by 300 ms to avoid a request per keystroke, and `%` / `_` typed by the user are escaped so they match literally. MySQL's default collation makes the match case-insensitive.
- **Layers:** routes map URLs to controllers; controllers handle HTTP and validation; the service holds the SQL. Errors are thrown as `ApiError` and converted to JSON in one error-handling middleware.
- **Money** is stored as `DECIMAL(10,2)`, never floating point.
- **Delete** returns `204`; deleting a product that no longer exists returns `404` instead of pretending it succeeded.

## Assumptions and limitations

- Price and quantity are required on create and update; description and category are optional.
- Prices are displayed in Indian Rupees(INR)(one constant in `client/src/utils/format.ts`); no currency is stored in the database.
- No authentication or user accounts, as they were not part of the assignment.
- The list is not paginated or sortable (newest first), because the assignment did not ask for it.
- `PUT` replaces all editable fields rather than patching individual ones.
- No automated tests are included.
- Requires MySQL 8.0.16+ for the `CHECK` constraints to be enforced (older versions ignore them, but the API still validates).


