# AI-Powered Customer Support Desk

## Overview

An AI-assisted ticketing system designed for SaaS & e-commerce businesses that automatically categorizes, prioritizes, and routes customer queries to the right support agents, while giving admins real-time visibility of the support pipeline.

---

## Core Features

### 1. Authentication & Role Management

- Sign-up and login with email & password.
- Optional referral code during sign-up to assign roles:
  - **User** – Can submit and track tickets.
  - **Moderator** – Assigned tickets to resolve.
  - **Admin** – Full system oversight and user management.
- Role-based access control.

---

### 2. User Portal (Customer View)

- **Submit Ticket Form**: Title, description, optional category.
- **AI Helpful Notes Display**: After ticket submission, AI provides instant helpful suggestions.
- **Ticket Status Tracker**: View ticket status (Pending, In Progress, Resolved).

---

### 3. Moderator Dashboard

- **Ticket Queue**: List of assigned tickets with filters for priority, status, and date.
- **Ticket Detail View**: AI-generated notes, priority level, and customer details.
- **Actions**:
  - Update ticket status (In Progress, Resolved).

---

### 4. Admin Dashboard

- **Global Ticket Overview**: All tickets sorted by priority & SLA deadlines.
- **Analytics**:
  - Average resolution time.
  - Ticket volume trends.
  - Moderator performance metrics.
- **Referral Tracking**: View referral-based sign-ups and role assignments.

---

### 5. AI Processing Backend

- **Priority Assignment**: Categorizes tickets into Critical, High, Medium, Low.
- **Helpful Notes Generation**: AI suggests initial solutions.
- **Auto-Assignment**: Routes tickets to the appropriate moderator based on category or workload.

---

## Example Workflow

1. **User** submits a ticket: "Payment failed but money deducted".
2. **AI**:
   - Assigns **High Priority**.
   - Generates helpful notes (“Check payment gateway logs, initiate refund process”).
   - Assigns ticket to the billing support moderator.
3. **Moderator** resolves the ticket and updates status to "Resolved".
4. **Admin** monitors analytics and sees refund-related tickets are increasing, triggering business action.

---

## MVP Scope

- User sign-up/login with referral-based roles.
- Ticket submission with AI-powered prioritization & helpful notes.
- Role-specific dashboards (User, Moderator, Admin).
- Real-time status tracking & notifications.
- Basic analytics in Admin dashboard.

---

## Pending Tasks

- Remove filters even from admin
- Try to complete the KPI part
- Only users should be able to create the tickets
- admin screen will be tab based
  - 1. users - to manage users
  - 2. Tickets - to manage tickets
