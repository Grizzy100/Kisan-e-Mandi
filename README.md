<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=40&pause=1000&color=16A34A&center=true&vCenter=true&width=700&lines=Kisan-e-Mandi+%F0%9F%8C%BE;Empowering+Farmers.;Removing+Middlemen.;Building+Transparent+Markets." alt="Kisan-e-Mandi" />

<br/>

**A farmer-centric digital marketplace that removes the middleman, ensures listing quality through admin verification, and builds a community where farmers connect and thrive.**

<br/>

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/identity)

</div>

---

## 🎯 The Problem

India's agricultural supply chain has a structural flaw — the value created by farmers is captured by intermediaries, not the people who grew the food.

| The Old Way | With Kisan-e-Mandi |
|---|---|
| Farmers sell through middlemen at suppressed prices | Farmers sell **directly to customers** |
| Buyers have no visibility into crop origin or quality | Every listing is **admin-verified** before going live |
| No community or knowledge-sharing layer | Farmers have a **community space** to connect and share |
| Digital tools built for tech-literate users | Simple, guided workflows designed for **all literacy levels** |

---

## 📸 Platform Showcase

<details open>
<summary><b>🌿 Landing Page</b></summary>
<br/>

![Landing Page](https://github.com/Grizzy100/Kisan-e-Mandi/blob/c9628d863a73746ac08515d662b33c3af3c7f43b/Landing%20Page.png?raw=true)

</details>

<details open>
<summary><b>👨‍🌾 Farmer Dashboard</b></summary>
<br/>

![Farmer Dashboard](https://github.com/Grizzy100/Kisan-e-Mandi/blob/c9628d863a73746ac08515d662b33c3af3c7f43b/Vendor%20Home%20page.png?raw=true)

</details>

<details open>
<summary><b>🛒 Customer Marketplace</b></summary>
<br/>

![Customer Marketplace](https://github.com/Grizzy100/Kisan-e-Mandi/blob/c9628d863a73746ac08515d662b33c3af3c7f43b/Customer%20Home%20page.png?raw=true)

</details>

<details open>
<summary><b>🧑‍💼 Admin Dashboard</b></summary>
<br/>

![Admin Panel](https://github.com/Grizzy100/Kisan-e-Mandi/blob/main/Admin%20Dashbaord.png?raw=true)

</details>

<details open>
<summary><b>📦 Vendor Marketplace</b></summary>
<br/>

![Vendor Marketplace](https://github.com/Grizzy100/Kisan-e-Mandi/blob/c9628d863a73746ac08515d662b33c3af3c7f43b/Vendor%20Market%20Place.png?raw=true)

</details>

---

## ⭐ Core Features

### 🎫 Ticket-Based Listing Verification

Instead of allowing any farmer to post any product instantly, Kisan-e-Mandi enforces a **verified listing workflow**. Every product goes through human review before it can reach customers.

```
👨‍🌾 Farmer raises listing ticket
          │
          ▼
   [TICKET: PENDING]
          │
          ▼
🧑‍💼 Admin reviews crop details
          │
     ┌────┴────┐
     │         │
  Approved   Rejected ──► Farmer notified (Nodemailer)
     │
     ▼
[LISTING: VERIFIED]
          │
          ▼
👨‍🌾 Farmer decides when to go live
          │
     ┌────┴──────────┐
     │               │
  Accept Now     Shelf (Later)
     │
     ▼
🛒 Product live on marketplace
```

This ensures **no unverified or fraudulent listings** reach buyers, while giving farmers full control over their own publish timing.

---

### 📉 Direct Farmer-to-Customer Sales

Every purchase on the marketplace goes **directly from the verified farmer to the customer** — no intermediary takes a cut. Buyers know exactly which farmer grew what they're buying.

---

### 🧑‍💼 Admin Control Centre

The admin panel provides full platform governance:

| Capability | Description |
|---|---|
| 🎫 Ticket moderation | Review and approve/reject farmer listing requests |
| 👨‍🌾 Vendor management | Manage farmer accounts & verification status |
| 👤 Customer management | Handle customer accounts & complaints |
| 📊 Platform analytics | Track listings, sales, and activity dashboards |
| 📧 Email notifications | Automated Nodemailer emails on ticket decisions |

---

### 👥 Platform Roles

| Role | Capabilities |
|---|---|
| **🌾 Farmer** | Raise listing tickets · Upload crop details · Manage inventory · Accept or delay going live · Join community discussions |
| **🛒 Customer** | Browse the marketplace · Discover deals · Add to cart · Buy directly from verified farmers |
| **🧑‍💼 Admin** | Verify tickets · Approve listings · Manage all users · Handle support |

---

### 🔐 Google OAuth Authentication

No passwords to store, no friction for farmers unfamiliar with traditional signup flows.

```
User clicks Sign In
        │
        ▼
Google OAuth consent
        │
        ▼
Google returns verified identity
        │
        ▼
Role assigned (Farmer / Customer)
        │
        ▼
Dashboard loaded
```

**Benefits:** Secure by default · No credential storage · Faster onboarding for users with limited digital literacy.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                  React + Vite Client                  │
│         (Tailwind CSS · Framer Motion · React Router) │
└──────────────────────┬───────────────────────────────┘
                       │  REST API
                       ▼
┌──────────────────────────────────────────────────────┐
│              Node.js + Express Backend                │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Auth Routes  │  │ Listing/     │  │ Community  │  │
│  │ Google OAuth │  │ Ticket       │  │ Posts      │  │
│  └──────────────┘  │ Routes       │  └────────────┘  │
│                    └──────────────┘                  │
│  ┌──────────────┐  ┌──────────────┐                  │
│  │ Admin Routes │  │ Nodemailer   │                  │
│  │ (moderation) │  │ (email notif)│                  │
│  └──────────────┘  └──────────────┘                  │
└──────────────────────┬───────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
   ┌──────▼──────┐         ┌────────▼──────┐
   │   MongoDB   │         │  Cloudinary   │
   │  (Mongoose) │         │ (crop images) │
   └─────────────┘         └───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI component framework |
| Vite | Lightning-fast dev server & bundler |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Smooth animations & transitions |
| React Router | Client-side routing |
| React Toastify | User notification toasts |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Document database & ODM |
| Cloudinary | Crop image storage & delivery |
| Multer | Multipart file upload handling |
| Nodemailer | Admin notification emails on ticket decisions |
| Google OAuth | Secure authentication (no password storage) |

---

## 🚀 Running the Project

### Prerequisites

- Node.js LTS
- MongoDB (local or Atlas connection string)
- Cloudinary account
- Google OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/Grizzy100/Kisan-e-Mandi.git
cd Kisan-e-Mandi
```

### 2. Configure environment variables

```bash
# server/.env
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
NODEMAILER_USER=
NODEMAILER_PASS=
SESSION_SECRET=
CLIENT_URL=http://localhost:5173
```

### 3. Install & run the backend

```bash
cd server
npm install
npm run server
```

### 4. Install & run the frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## 🔮 Roadmap

| Area | Planned Improvement |
|---|---|
| 💳 **Payment Gateway** | Secure in-platform payments between farmers and customers |
| 🤖 **AI Price Prediction** | ML-based crop price forecasting from market trends |
| 📦 **Logistics Integration** | Built-in delivery coordination |
| 📱 **Mobile App** | React Native app for low-connectivity rural environments |
| 🌍 **Multi-Language Support** | Hindi, regional languages for farmer accessibility |
| 📊 **Farmer Analytics** | Revenue trends, best-performing crops, buyer insights |

---

## 🧠 Engineering Takeaway

> Kisan-e-Mandi taught me that the most impactful systems aren't necessarily the most technically complex.
>
> The challenge here wasn't distributed systems or event sourcing — it was **understanding the real user**, designing workflows for people unfamiliar with technology, and building trust mechanisms (admin verification) that make a marketplace actually usable.
>
> Sometimes the hardest engineering problem is not technical at all.
> It's figuring out **what to build** and **why it matters**.

---

<div align="center">

🌾 Built to give farmers a fair shot at the market they feed.

⭐ If this resonates with you, consider starring the repo!

</div>
