
# Kisan-e-Mandi: Problems Faced, Solutions, and Collaboration

> This document details the main technical challenges I faced while developing Kisan-e-Mandi, how I solved them (sometimes with the help of AI tools), and references to the specific files and folders involved. This demonstrates both my hands-on coding and my ability to leverage AI for efficient problem-solving.


## 1. Missing Listings After Approval
- **Problem:** Approved farmer tickets were not showing up as listings in the marketplace.
- **Root Cause:** The auto-create Item logic did not exist when some tickets were approved, so no Item was created for those tickets.
- **How I Solved It:**
  - I wrote and ran a diagnostic/fix script to backfill missing Items and ensure correct category assignment.
  - **Reference:** See `server/scripts/diagItems.js` and `server/scripts/backfillCategory.js`.
  - I used AI to help design the script logic and verify the database queries.


## 2. Category Label Inconsistency
- **Problem:** The displayed category label for items (e.g., "Rice" vs. "Wheat") was sometimes incorrect or lost.
- **Root Cause:** The Item schema did not preserve the original ticket category, leading to mismatches between the ticket and the item listing.
- **How I Solved It:**
  - I updated the Item schema (`server/models/Item.js`) to add a `ticketCategory` field.
  - Updated the frontend to display this field in `client/src/components/Dashboard/Item/ProductCard.jsx`.
  - AI helped me ensure the changes were reflected in both backend and frontend.


## 3. Accept/Later Flow Not Working
- **Problem:** The Accept/Later buttons were not appearing or functioning as expected for farmers after admin approval.
- **Root Cause:** The admin approval flow was directly publishing items instead of setting them to an intermediate state (`approved_hidden`).
- **How I Solved It:**
  - Modified the backend approval logic in `server/controllers/supportController.js` to set items to `approved_hidden`.
  - Updated frontend logic in `client/src/components/Dashboard/MySection.jsx` to show Accept/Later buttons for these items.
  - AI assisted in reviewing the flow and suggesting improvements.


## 4. Order System Implementation
- **Problem:** There was no backend or frontend system for handling customer orders, tracking, or vendor notifications.
- **How I Solved It:**
  - Designed and implemented a full order system:
    - **Backend:** Created `server/models/Order.js`, `server/controllers/orderController.js`, and `server/routes/orderRoutes.js`. Integrated Nodemailer for vendor notifications (`server/config/nodemailer.js`).
    - **Frontend:** Built order modal (`client/src/components/Dashboard/Item/OrderModal.jsx`), customer/vendor order tracking pages (`client/src/components/Dashboard/CustomerOrders.jsx`, `VendorOrders.jsx`), and wired them into the dashboard (`client/src/pages/MainDashboard.jsx`).
  - Used AI to help with REST API design and error handling.


## 5. Dashboard Stats Accuracy
- **Problem:** Dashboard sales and stats were not reflecting real order data.
- **How I Solved It:**
  - Updated stats logic in `client/src/components/Dashboard/StatsCard.jsx` and related backend endpoints to use actual order revenue and counts.
  - AI helped validate the aggregation logic and test edge cases.


## 6. Database State Issues
- **Problem:** Legacy data and inconsistent states (e.g., items published without proper approval flow) caused confusion and bugs.
- **How I Solved It:**
  - Created and ran scripts to reset, backfill, and repair database state for consistent testing and production behavior (`server/scripts/resetToApprovedHidden.js`).
  - AI assisted in designing safe migration scripts.


## 7. Frontend/Backend Synchronization
- **Problem:** Ensuring that frontend UI and backend API changes stayed in sync, especially after schema or flow updates.
- **How I Solved It:**
  - Coordinated API, model, and UI changes across files like `client/src/api/orderAPI.js`, `server/controllers/itemController.js`, and related components.
  - Used AI to cross-check for missing updates and regression bugs.


## 8. Minor CSS/Warning Issues
- **Problem:** Some minor CSS warnings and formatting issues appeared during development.
- **How I Solved It:**
  - Fixed all warnings in files like `client/src/App.css` and `client/src/components/Dashboard/Item/ProductCard.jsx`.
  - AI helped quickly identify and resolve style issues.

---


## Summary
Throughout the project, I combined my coding skills with AI-powered assistance to debug, refactor, and implement robust solutions. By referencing specific files and folders, I ensured traceability and maintainability. This collaborative approach made the development process faster and more reliable.