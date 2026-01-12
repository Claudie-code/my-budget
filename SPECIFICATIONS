# MyBudget – Specifications (MVP)

## 1. Project Overview

This application is a personal budgeting tool based on the envelope budgeting method.
It allows an authenticated user to define a monthly budget, allocate funds across spending categories (envelopes), record transactions, and track remaining balances in real time.
The application also provides a simple monthly forecast to help users compare planned budgets versus actual spending.
The goal of this project is to demonstrate the design and implementation of a complete fullstack application, including authentication, business logic, data persistence, and a user dashboard.

## 2. Target Users

The primary target user is an individual who wants a simple and structured way to manage personal finances on a monthly basis.
This application is not intended for businesses, shared budgets, or advanced accounting use cases.

## 3. Core Concepts

Envelope budgeting is a budgeting method where a total monthly income is divided into categories (envelopes).

Each envelope has a fixed amount assigned at the beginning of the month.
Expenses reduce the available balance of the corresponding envelope.
Once an envelope is empty, no more spending should occur in that category.

## 4. Functional Scope (MVP)

### 4.1 Authentication

- Users must be authenticated to access the application.
- Authentication is email and password based.
- Each user has access only to their own data.

### 4.2 Budget Setup

- A user defines a monthly budget amount.
- A user creates spending categories (envelopes).
- Each envelope has:
  - a name
  - an allocated amount

### 4.3 Transactions

- A user can record an expense.
- Each expense:
  - has an amount
  - belongs to a category
  - has a date
  - has an optional description
- Recording an expense decreases the remaining balance of the associated envelope.

### 4.4 Dashboard

The main dashboard displays:
- total monthly budget
- total spent
- remaining budget
- list of envelopes with:
  - allocated amount
  - spent amount
  - remaining balance

### 4.5 Monthly Forecast (Simple)

- The application shows a basic comparison between:
  - planned budget
  - actual spending
- No advanced predictions or machine learning are included in the MVP.

## 5. Non-Goals (Out of Scope for MVP)

- Bank synchronization
- Multiple currencies
- Shared or collaborative budgets
- Advanced analytics
- Mobile application

## 6. Technical Scope

- Frontend: React (SPA)
- Backend: API-based architecture
- Authentication handled server-side
- Persistent storage for users, categories, expenses

## 7. Success Criteria

- A user can create an account
- Set a monthly budget
- Track expenses
- Clearly see how much money remains per category

## 8. Evolution (Post-MVP)

Potential future improvements include:
- recurring expenses
- charts and visualizations
- budget rollover between months
- public landing page

