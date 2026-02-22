# MoMoGo - Requirements Documentation

## Project Overview
MoMoGo is an online momo ordering and delivery platform with separate interfaces for customers and administrators.

---

## User Stories

### Priority 1: Critical (Must Have)

---

#### US-01: Customer Registration
**As a** new customer,  
**I want to** create an account using my email and phone number,  
**So that** I can place orders and track my delivery history.

**Acceptance Criteria:**
- Customer can register from the customer login page
- Email and phone number are required fields
- Password must be at least 8 characters with one number
- System sends email verification link
- Customer sees success message after registration
- Duplicate email/phone shows appropriate error

**Priority:** 🔴 Critical

---

#### US-02: Customer Login
**As a** registered customer,  
**I want to** log in to my account using email and password,  
**So that** I can access my profile and place orders.

**Acceptance Criteria:**
- Separate customer login page exists (distinct from admin)
- Customer can log in with email and password
- Invalid credentials show error message
- Successful login redirects to home/menu page
- "Remember me" option available
- Password reset link available on login page

**Priority:** 🔴 Critical

---

#### US-03: Admin Login
**As an** administrator,  
**I want to** log in through a separate admin portal,  
**So that** I can access the admin dashboard securely.

**Acceptance Criteria:**
- Separate admin login page exists at `/admin/login`
- Admin credentials are different from customer accounts
- Failed login attempts are logged
- Successful login redirects to admin dashboard
- Session timeout after 30 minutes of inactivity

**Priority:** 🔴 Critical

---

#### US-04: Place Order
**As a** customer,  
**I want to** add items to cart and complete checkout,  
**So that** I can order momos for delivery.

**Acceptance Criteria:**
- Customer can add/remove items from cart
- Customer can adjust item quantities
- Order summary shows itemized pricing
- Delivery address is required at checkout
- Customer receives order confirmation with order ID
- Order is saved to database with "Pending" status

**Priority:** 🔴 Critical

---

#### US-05: Admin View All Orders
**As an** administrator,  
**I want to** view all customer orders in a dashboard,  
**So that** I can manage and fulfill orders efficiently.

**Acceptance Criteria:**
- Admin dashboard shows list of all orders
- Orders display: Order ID, Customer name, Items, Total, Status, Time
- Orders can be filtered by status (Pending, Preparing, Delivered, Cancelled)
- Orders can be sorted by date/time
- Order details expandable to show full information
- Real-time updates when new orders arrive

**Priority:** 🔴 Critical

---

### Priority 2: High (Should Have)

---

#### US-06: Update Order Status
**As an** administrator,  
**I want to** update the status of an order,  
**So that** customers can track their order progress.

**Acceptance Criteria:**
- Admin can change order status: Pending → Preparing → Out for Delivery → Delivered
- Admin can cancel orders with reason
- Status change triggers notification to customer
- Status change is timestamped in order history
- Cancelled orders show cancellation reason

**Priority:** 🟠 High

---

#### US-07: Customer Order History
**As a** registered customer,  
**I want to** view my past orders,  
**So that** I can reorder or track my spending.

**Acceptance Criteria:**
- Customer can view list of all past orders
- Each order shows: Date, Items, Total, Status
- Customer can view detailed order information
- "Reorder" button available for past orders
- Orders sorted by most recent first

**Priority:** 🟠 High

---

#### US-08: Password Reset
**As a** registered user (customer or admin),  
**I want to** reset my password using my email,  
**So that** I can regain access if I forget my password.

**Acceptance Criteria:**
- Password reset available on both login pages
- System sends reset email within 1 minute
- Reset link expires after 24 hours
- User must enter and confirm new password
- Success message shown after password reset
- Old password no longer works after reset

**Priority:** 🟠 High

---

### Priority 3: Medium (Nice to Have)

---

#### US-09: Admin Menu Management
**As an** administrator,  
**I want to** add, edit, and remove menu items,  
**So that** I can keep the menu updated.

**Acceptance Criteria:**
- Admin can add new menu items with name, description, price, image
- Admin can edit existing menu items
- Admin can mark items as unavailable (without deleting)
- Admin can delete menu items
- Changes reflect immediately on customer-facing menu
- Admin can set items as "Popular" or "Spicy"

**Priority:** 🟡 Medium

---

#### US-10: Order Notifications
**As a** customer,  
**I want to** receive notifications about my order status,  
**So that** I know when my food is being prepared and delivered.

**Acceptance Criteria:**
- Email notification sent when order is confirmed
- Notification when order status changes
- Notification includes estimated delivery time
- Customer can opt-out of notifications in profile

**Priority:** 🟡 Medium

---

#### US-11: Guest Checkout
**As a** guest user,  
**I want to** place an order without creating an account,  
**So that** I can order quickly without registration.

**Acceptance Criteria:**
- Guest can add items to cart and checkout
- Guest must provide name, phone, email, delivery address
- Guest receives order confirmation via email
- Guest cannot view order history (no account)
- Option to create account after checkout

**Priority:** 🟡 Medium

---

## Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            MoMoGo System                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   ┌─────────────┐          ┌─────────────────┐                       │   │
│  │   │   Browse    │          │    Register     │                       │   │
│  │   │    Menu     │          │    Account      │                       │   │
│  │   └──────┬──────┘          └────────┬────────┘                       │   │
│  │          │                          │                                │   │
│  │          │    ┌─────────────────────┼─────────────────┐              │   │
│  │          │    │                     │                 │              │   │
│  │          ▼    ▼                     ▼                 │              │   │
│  │   ┌─────────────┐          ┌─────────────────┐        │              │   │
│  │   │  Add to     │          │     Login       │        │              │   │
│  │   │   Cart      │          │   (Customer)    │        │              │   │
│  │   └──────┬──────┘          └────────┬────────┘        │              │   │
│  │          │                          │                 │              │   │
│  │          ▼                          │                 │              │   │
│  │   ┌─────────────┐                   │                 │              │   │
│  │   │   Place     │◄──────────────────┘                 │              │   │
│  │   │   Order     │                                     │              │   │
│  │   └──────┬──────┘                                     │              │   │
│  │          │                                            │              │   │
│ ┌┴┐         ▼                                            │              │   │
│ │C│  ┌─────────────┐          ┌─────────────────┐        │              │   │
│ │U│  │   Track     │          │  View Order     │        │              │   │
│ │S│  │   Order     │          │   History       │◄───────┘              │   │
│ │T│  └─────────────┘          └─────────────────┘                       │   │
│ │O│                                                                     │   │
│ │M│  ┌─────────────┐          ┌─────────────────┐                       │   │
│ │E│  │   Reset     │          │  Update Profile │                       │   │
│ │R│  │  Password   │          │                 │                       │   │
│ └┬┘  └─────────────┘          └─────────────────┘                       │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   ┌─────────────┐          ┌─────────────────┐                       │   │
│  │   │    Login    │          │   View All      │                       │   │
│  │   │   (Admin)   │─────────►│    Orders       │                       │   │
│  │   └─────────────┘          └────────┬────────┘                       │   │
│  │                                     │                                │   │
│  │                                     ▼                                │   │
│  │   ┌─────────────┐          ┌─────────────────┐                       │   │
│ ┌┴┐  │   Manage    │          │  Update Order   │                       │   │
│ │A│  │    Menu     │          │    Status       │                       │   │
│ │D│  └─────────────┘          └─────────────────┘                       │   │
│ │M│                                                                     │   │
│ │I│  ┌─────────────┐          ┌─────────────────┐                       │   │
│ │N│  │   View      │          │  Manage Users   │                       │   │
│ │ │  │  Analytics  │          │                 │                       │   │
│ └┬┘  └─────────────┘          └─────────────────┘                       │   │
│  │                                                                      │   │
│  │   ┌─────────────┐                                                    │   │
│  │   │   Reset     │                                                    │   │
│  │   │  Password   │                                                    │   │
│  │   └─────────────┘                                                    │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Actors Summary

| Actor | Description |
|-------|-------------|
| **Customer** | End user who browses menu, places orders, and tracks deliveries |
| **Admin** | System administrator who manages orders, menu, and has full system access |
| **Guest** | Unregistered user who can browse and place orders without an account |

---

## Priority Summary

| Priority | User Stories | Description |
|----------|--------------|-------------|
| 🔴 Critical | US-01, US-02, US-03, US-04, US-05 | Core functionality for MVP |
| 🟠 High | US-06, US-07, US-08 | Important features for complete experience |
| 🟡 Medium | US-09, US-10, US-11 | Enhancement features |

---

## Next Steps

1. ✅ Requirements documented
2. ⏳ Enable Lovable Cloud for backend
3. ⏳ Create database schema (users, orders, menu_items)
4. ⏳ Implement authentication (Customer + Admin)
5. ⏳ Build order management system
