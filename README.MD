# School Fees Payment Management API

A RESTful backend API that lets a school manage students, fee categories, invoices and payments, and track every invoice's outstanding balance and payment status.

**Group 5 members**

| Member | Part of the project |
|---|---|
| Chigoziem John Ogbonnaya | Project structure and setup, Payments |
| Okonkwo Uchenna Emmanuel | Fee Categories |
| Paul Egbeme | Invoices |
| Elijah Ofosu | Students |

---

## Table of contents

1. [How the system works](#1-how-the-system-works)
2. [Tech stack](#2-tech-stack)
3. [Installation and setup](#3-installation-and-setup)
4. [Project structure](#4-project-structure)
5. [Database design](#5-database-design)
6. [Sequelize associations](#6-sequelize-associations)
7. [Business rules](#7-business-rules)
8. [Validation rules](#8-validation-rules)
9. [Error handling](#9-error-handling)
10. [API endpoints with sample requests and responses](#10-api-endpoints-with-sample-requests-and-responses)
11. [Testing with Postman](#11-testing-with-postman)

---

## 1. How the system works

The school sets up **fee categories** (for example Tuition at ₦150,000). Students are registered, and the school creates an **invoice** (a bill) for a student against a fee category. When the student pays, a **payment** is recorded against the invoice. The API works out the **outstanding balance** and updates the invoice **status**.

Example: a ₦150,000 invoice with a ₦50,000 payment has a balance of ₦100,000 and the status **Partially Paid**. A further payment bigger than ₦100,000 is refused.

All amounts are whole naira, stored as integers (an amount of `50000` means ₦50,000).

---

## 2. Tech stack

- Node.js and Express
- MySQL (hosted on Aiven)
- Sequelize ORM with Sequelize migrations and seeders
- Joi for request validation
- dotenv for environment variables

---

## 3. Installation and setup

**Requirements:** Node.js, npm, and a MySQL database.

1. **Clone the repository and open the folder**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install the dependencies**

   ```bash
   npm install
   ```

3. **Create your `.env` file** by copying the example, then fill in your own values.

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell use `copy .env.example .env`.

   | Variable | Meaning |
   |---|---|
   | `PORT` | Port the server runs on (defaults to 3000) |
   | `DB_HOST` | Database host |
   | `DB_PORT` | Database port |
   | `DB_USER` | Database user |
   | `DB_PASSWORD` | Database password |
   | `DB_NAME` | Database name |

   Never commit `.env`. It is listed in `.gitignore`.

4. **Run the migrations** to create the tables. They run in order: Students, FeeCategories, Invoices, Payments.

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Seed the database** with sample data (run this once).

   ```bash
   npx sequelize-cli db:seed:all
   ```

6. **Start the server**

   ```bash
   npm start
   ```

   The API runs at `http://localhost:3000` (or the port in your `.env`).

---

## 4. Project structure

```
project/
├── controllers/     request handling and business logic
├── database/        Sequelize database connection
├── middlewares/     Joi validation for each resource
├── migrations/      creates the database tables
├── models/          Sequelize models and associations
├── routes/          URL routes for each resource
├── seeders/         sample data
├── .env.example     names of the environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js        app entry point, mounts the routes
```

---

## 5. Database design

Four tables. Every table has a UUID primary key `id`, plus `createdAt` and `updatedAt`.

### Students

| Column | Type | Rules |
|---|---|---|
| id | UUID | primary key |
| firstName | string | required |
| lastName | string | required |
| email | string | required, unique |
| phoneNumber | string | required |

### FeeCategories

| Column | Type | Rules |
|---|---|---|
| id | UUID | primary key |
| name | string | required, unique |
| amount | integer | required, the standard price in naira |

### Invoices

| Column | Type | Rules |
|---|---|---|
| id | UUID | primary key |
| studentId | UUID | required, foreign key to Students.id |
| feeCategoryId | UUID | required, foreign key to FeeCategories.id |
| amount | integer | required, the amount billed |
| dueDate | date only | required |
| status | enum | `Unpaid`, `Partially Paid` or `Fully Paid`, default `Unpaid` |

### Payments

| Column | Type | Rules |
|---|---|---|
| id | UUID | primary key |
| invoiceId | UUID | required, foreign key to Invoices.id |
| amount | integer | required |
| paymentDate | date only | required |
| paymentMethod | enum | `POS`, `Cash`, `Transfer` or `Card` |

### Relationships

```
Student      1 ──── many  Invoice
FeeCategory  1 ──── many  Invoice
Invoice      1 ──── many  Payment
```

- One student can have many invoices.
- One fee category can appear on many invoices.
- One invoice can have many payments, because people pay in instalments.

### Why each table exists

- **Students** hold each person once, so their details are not repeated on every invoice.
- **FeeCategories** hold each type of fee and its standard price once.
- **Invoices** record what a particular student owes for a particular fee.
- **Payments** record each amount paid against an invoice, which gives the payment history.

### Foreign key constraints

All three foreign keys use `onDelete: RESTRICT` and `onUpdate: CASCADE`. A student, fee category or invoice that still has records depending on it cannot be deleted. This protects the financial history. To delete a student, delete their payments first, then their invoices, then the student.

---

## 6. Sequelize associations

Associations are defined in each model's `associate` method, which `models/index.js` calls automatically.

| Model | Association |
|---|---|
| Student | `hasMany(Invoice, { foreignKey: 'studentId', as: 'invoices' })` |
| FeeCategory | `hasMany(Invoice, { foreignKey: 'feeCategoryId', as: 'invoices' })` |
| Invoice | `belongsTo(Student, { foreignKey: 'studentId', as: 'student' })` |
| Invoice | `belongsTo(FeeCategory, { foreignKey: 'feeCategoryId', as: 'feeCategory' })` |
| Invoice | `hasMany(Payment, { foreignKey: 'invoiceId', as: 'payments' })` |
| Payment | `belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' })` |

Every one-to-many relationship has both sides defined. Related records are retrieved with `include`, for example an invoice with its student, fee category and payments:

```javascript
Invoice.findByPk(id, {
  include: [
    { model: FeeCategory, as: 'feeCategory' },
    { model: Student, as: 'student' },
    { model: Payment, as: 'payments' },
  ],
});
```

The `as` name in an `include` must match the `as` name in the association.

---

## 7. Business rules

- **Outstanding balance** = invoice amount minus the sum of all payments on that invoice. It is calculated, not stored.
- **Status** is `Unpaid` when there are no payments, `Partially Paid` when something has been paid and a balance remains, and `Fully Paid` when the balance is 0.
- The status is recalculated whenever a payment is created, updated or deleted, and when an invoice amount is updated.
- A payment cannot exceed the outstanding balance of its invoice.
- A payment must belong to an existing invoice.
- A new invoice always starts as `Unpaid`. The status cannot be set by the client.
- An invoice amount cannot be reduced below the total already paid.
- A payment's invoice cannot be changed after the payment is created.
- A student, fee category or invoice that still has dependent records cannot be deleted.

---

## 8. Validation rules

Validation uses Joi, before the controller runs. Fields that are not listed for an endpoint are rejected.

| Resource | Rules |
|---|---|
| Student | `firstName` and `lastName`: required, letters only, at least 3 characters, no spaces. `email`: required, valid email, unique. `phoneNumber`: required, valid phone number. |
| Fee category | `name`: required, 2 to 50 characters (letters, spaces, apostrophes, hyphens), unique. `amount`: required, whole number greater than 0. |
| Invoice | `studentId` and `feeCategoryId`: required, valid UUID, must exist. `amount`: required, whole number greater than 0. `dueDate`: required, `YYYY-MM-DD`. `status` is not accepted. |
| Payment | `invoiceId`: required, valid UUID, must exist. `amount`: required, whole number greater than 0, cannot exceed the balance. `paymentDate`: required, `YYYY-MM-DD`. `paymentMethod`: one of `POS`, `Cash`, `Transfer`, `Card`. |
| Updates (PATCH) | Only the fields sent are changed, and at least one field is required. |
| IDs in the URL | Must be a valid UUID, otherwise the API returns 400. |

---

## 9. Error handling

| Status | When |
|---|---|
| 200 | Successful read, update or delete |
| 201 | Successful create |
| 400 | Invalid input (validation), invalid UUID in the URL, or a payment or invoice amount that conflicts with the balance |
| 404 | The student, fee category, invoice or payment does not exist |
| 409 | A duplicate (student email, fee category name), or a delete blocked by dependent records |
| 500 | Unexpected server error. The message is always generic and the real error is only logged on the server. |

Every error response has the form:

```json
{ "message": "A description of what went wrong" }
```

---

## 10. API endpoints with sample requests and responses

Base URL: `http://localhost:3000`

IDs and timestamps in the examples are sample values.

### 10.1 Students: `/students`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/students` | Create a student |
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get one student |
| PATCH | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

**POST /students** request body

```json
{
  "firstName": "Chika",
  "lastName": "Okafor",
  "email": "chika.okafor@example.com",
  "phoneNumber": "+2348012345678"
}
```

Response `201`

```json
{
  "message": "Student created successfully",
  "data": {
    "id": "3f8a1c52-9b7e-4d2a-a1c4-6e5b8d9f0a12",
    "firstName": "Chika",
    "lastName": "Okafor",
    "email": "chika.okafor@example.com",
    "phoneNumber": "+2348012345678",
    "createdAt": "2026-11-05T10:15:30.000Z",
    "updatedAt": "2026-11-05T10:15:30.000Z"
  }
}
```

**PATCH /students/:id** request body (any one or more fields)

```json
{ "phoneNumber": "+2348098765432" }
```

Response `200`: `{ "message": "Student updated successfully", "data": { ...the updated student } }`

Error examples

| Case | Status | Response |
|---|---|---|
| Invalid email | 400 | `{ "message": "Email field must be a valid email address" }` |
| Duplicate email | 409 | `{ "message": "A student with this email already exists" }` |
| Student does not exist | 404 | `{ "message": "Student not found" }` |
| Student has invoices (delete) | 409 | `{ "message": "This student has invoices and cannot be deleted." }` |
| Invalid id in the URL | 400 | `{ "message": "Please provide a valid id." }` |

### 10.2 Fee categories: `/fee-categories`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/fee-categories` | Create a fee category |
| GET | `/fee-categories` | Get all fee categories |
| GET | `/fee-categories/:id` | Get one fee category |
| PATCH | `/fee-categories/:id` | Update a fee category |
| DELETE | `/fee-categories/:id` | Delete a fee category |

**POST /fee-categories** request body

```json
{
  "name": "Tuition",
  "amount": 150000
}
```

Response `201`

```json
{
  "message": "Fee category created successfully",
  "data": {
    "id": "7c1d9e30-4b2a-4f6e-8a35-1d2c3b4a5e67",
    "name": "Tuition",
    "amount": 150000,
    "createdAt": "2026-11-05T10:20:00.000Z",
    "updatedAt": "2026-11-05T10:20:00.000Z"
  }
}
```

Error examples

| Case | Status | Response |
|---|---|---|
| Amount is not a whole number | 400 | `{ "message": "Amount must be a whole number." }` |
| Amount is zero or negative | 400 | `{ "message": "Amount must be greater than zero." }` |
| Duplicate name | 409 | `{ "message": "A fee category with this name already exists" }` |
| Fee category does not exist | 404 | `{ "message": "Fee category not found" }` |
| Used by invoices (delete) | 409 | `{ "message": "This fee category is used by invoices and cannot be deleted." }` |

### 10.3 Invoices: `/invoices`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/invoices` | Create an invoice for a student |
| GET | `/invoices` | Get all invoices (with student and fee category) |
| GET | `/invoices/:id` | Get one invoice with its payments, total paid and outstanding balance |
| GET | `/invoices/student/:studentId` | Get all invoices belonging to one student |
| PATCH | `/invoices/:id` | Update an invoice's amount or due date |
| DELETE | `/invoices/:id` | Delete an invoice that has no payments |

**POST /invoices** request body

```json
{
  "studentId": "3f8a1c52-9b7e-4d2a-a1c4-6e5b8d9f0a12",
  "feeCategoryId": "7c1d9e30-4b2a-4f6e-8a35-1d2c3b4a5e67",
  "amount": 150000,
  "dueDate": "2026-12-15"
}
```

Response `201`

```json
{
  "message": "Invoice created successfully",
  "data": {
    "id": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
    "studentId": "3f8a1c52-9b7e-4d2a-a1c4-6e5b8d9f0a12",
    "feeCategoryId": "7c1d9e30-4b2a-4f6e-8a35-1d2c3b4a5e67",
    "amount": 150000,
    "dueDate": "2026-12-15",
    "status": "Unpaid",
    "createdAt": "2026-11-05T10:30:00.000Z",
    "updatedAt": "2026-11-05T10:30:00.000Z"
  }
}
```

**GET /invoices/:id** response `200` (after a ₦50,000 payment)

```json
{
  "message": "Invoice retrieved successfully",
  "totalPaid": 50000,
  "outstandingBalance": 100000,
  "data": {
    "id": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
    "studentId": "3f8a1c52-9b7e-4d2a-a1c4-6e5b8d9f0a12",
    "feeCategoryId": "7c1d9e30-4b2a-4f6e-8a35-1d2c3b4a5e67",
    "amount": 150000,
    "dueDate": "2026-12-15",
    "status": "Partially Paid",
    "feeCategory": { "id": "7c1d9e30-4b2a-4f6e-8a35-1d2c3b4a5e67", "name": "Tuition", "amount": 150000 },
    "student": { "id": "3f8a1c52-9b7e-4d2a-a1c4-6e5b8d9f0a12", "firstName": "Chika", "lastName": "Okafor" },
    "payments": [
      {
        "id": "d4f6a8c0-2e4b-4c6d-b8f0-3a5c7e9b1d2f",
        "invoiceId": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
        "amount": 50000,
        "paymentDate": "2026-11-06",
        "paymentMethod": "Transfer"
      }
    ]
  }
}
```

(Some fields are shortened in this example.)

**PATCH /invoices/:id** request body

```json
{ "dueDate": "2026-12-31" }
```

Error examples

| Case | Status | Response |
|---|---|---|
| Student does not exist | 404 | `{ "message": "Student not found" }` |
| Fee category does not exist | 404 | `{ "message": "Fee category not found" }` |
| Missing amount | 400 | `{ "message": "Amount is required." }` |
| Invalid date format | 400 | `{ "message": "Due date must use YYYY-MM-DD format." }` |
| Status sent in the request | 400 | `{ "message": "\"status\" is not allowed" }` |
| Amount lower than total already paid | 400 | `{ "message": "Amount: 40000 cannot be less than the total already paid: 50000" }` |
| Invoice has payments (delete) | 409 | `{ "message": "This invoice has payments and cannot be deleted." }` |

### 10.4 Payments: `/payments`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/payments` | Record a payment against an invoice |
| GET | `/payments` | Get all payments |
| GET | `/payments/:id` | Get one payment |
| PATCH | `/payments/:id` | Update a payment |
| DELETE | `/payments/:id` | Delete a payment |
| GET | `/payments/invoice/:invoiceId` | Get all payments made against one invoice |
| GET | `/payments/student/:studentId` | Get a student's full payment history (with the invoice of each payment) |

**POST /payments** request body

```json
{
  "invoiceId": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
  "amount": 50000,
  "paymentDate": "2026-11-06",
  "paymentMethod": "Transfer"
}
```

Response `201`

```json
{
  "message": "Payment Successful",
  "data": {
    "id": "d4f6a8c0-2e4b-4c6d-b8f0-3a5c7e9b1d2f",
    "invoiceId": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
    "amount": 50000,
    "paymentDate": "2026-11-06",
    "paymentMethod": "Transfer",
    "createdAt": "2026-11-06T09:00:00.000Z",
    "updatedAt": "2026-11-06T09:00:00.000Z"
  }
}
```

After this payment the invoice status becomes `Partially Paid`. When the payments add up to the invoice amount, it becomes `Fully Paid`.

**Overpayment** (the balance is 100000)

```json
{
  "amount": 120000
}
```

Response `400`

```json
{ "message": "The payment: 120000 exceeds the outstanding balance: 100000" }
```

**PATCH /payments/:id** request body (any one or more of the three fields)

```json
{ "paymentMethod": "Cash" }
```

**GET /payments/invoice/:invoiceId** response `200`

```json
{
  "message": "All Payments to this invoice retrieved successfully.",
  "data": [
    {
      "id": "d4f6a8c0-2e4b-4c6d-b8f0-3a5c7e9b1d2f",
      "invoiceId": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
      "amount": 50000,
      "paymentDate": "2026-11-06",
      "paymentMethod": "Transfer"
    }
  ]
}
```

**GET /payments/student/:studentId** response `200`

```json
{
  "message": "All Payments with associated Invoices retrieved successfully.",
  "data": [
    {
      "id": "d4f6a8c0-2e4b-4c6d-b8f0-3a5c7e9b1d2f",
      "amount": 50000,
      "paymentDate": "2026-11-06",
      "paymentMethod": "Transfer",
      "invoice": {
        "id": "b2e4a6c8-1d3f-4a5b-9c7e-0f1a2b3c4d5e",
        "amount": 150000,
        "status": "Partially Paid"
      }
    }
  ]
}
```

Error examples

| Case | Status | Response |
|---|---|---|
| Invoice does not exist | 404 | `{ "message": "Invoice does not exist" }` |
| Amount exceeds the balance | 400 | `{ "message": "The payment: 120000 exceeds the outstanding balance: 100000" }` |
| Amount is not a whole number | 400 | `{ "message": "Payment amount must be a whole number." }` |
| Invalid payment method | 400 | `{ "message": "Payment method must be POS, Cash, Transfer or Card." }` |
| Invalid date format | 400 | `{ "message": "Payment date must use YYYY-MM-DD format." }` |
| Payment does not exist | 404 | `{ "message": "Payment with ID: <id> does not exist." }` |
| Invalid invoice id in the URL | 400 | `{ "message": "Please provide a valid invoiceId." }` |

---

## 11. Testing with Postman

Every endpoint was tested with Postman, including successful requests and failing requests.

Suggested order to repeat the full flow:

1. Create a student and a fee category.
2. Create an invoice for the student (status `Unpaid`).
3. Record a partial payment (status becomes `Partially Paid`).
4. Try to overpay (400).
5. Record the remaining amount (status becomes `Fully Paid`).
6. Get the payments of the invoice, then the student's payment history.
7. Delete a payment and check the status updates.
8. Try the error cases: invalid email, duplicate email, invalid UUID, missing record, deleting a student who has invoices.

Screenshots and the demo video are linked here: **add the link**
