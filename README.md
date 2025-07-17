# BillQuick AI

**Smart Billing & Inventory for Local Shops, powered by AI**

BillQuick AI is a modern, AI-powered web application designed to streamline billing, inventory management, and sales insights for local shop owners. With a clean, mobile-friendly interface and deep integration with Firebase and Google Gemini AI, BillQuick AI helps you manage your business efficiently and gain actionable insights from your sales data.

---

## 🚀 Features

- **Invoice Generation**: Create professional invoices with product name, quantity, unit price, and subtotal.
- **PDF Export**: Download and share invoices as PDFs.
- **Inventory Management**: Add, edit, and delete products with name, price, and quantity fields.
- **AI Sales Insights**: Leverage Gemini AI to determine top-selling items and generate sales summaries.
- **User Authentication**: Secure login and signup with email/password or Google.
- **Insights Dashboard**: View AI-generated insights on a dedicated page.
- **Responsive Design**: Optimized for mobile and desktop use.

---

## 🌐 Live Demo

Access the deployed app here: [https://bill-quick-ai.vercel.app/](https://bill-quick-ai.vercel.app/)

---

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Radix UI, Zustand
- **Backend/AI**: Firebase (Auth, Firestore), Genkit, Google Gemini AI
- **PDF Generation**: jsPDF
- **Form Validation**: React Hook Form, Zod

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BillQuick-AI.git
cd BillQuick-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your Firebase project credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Firestore Setup

- **Indexes**:  
  Follow the instructions in [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md) to create the required composite indexes for `bills` and `products` collections.
- **Security Rules**:  
  Deploy the provided `firestore.rules` to ensure user data isolation.

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002) to view the app locally.

---

## 🔒 Security

- **User Data Isolation**: Each user can only access their own data, enforced by Firestore security rules and application logic.
- **Authentication Required**: All data operations require a valid user session.
- **See**: [SECURITY.md](SECURITY.md) for details.

---

## 🤖 AI Insights

BillQuick AI uses Google Gemini AI (via Genkit) to analyze your sales data and provide:
- Top 5 best-selling items
- Sales summaries and trends
- Actionable insights for your business

---

## 🧑‍💻 Contributing

Contributions are welcome!  
If you wish to contribute, please fork the repository and submit a pull request.  
(If you have specific guidelines, add a `CONTRIBUTING.md` file.)

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📚 Additional Resources

- [FIRESTORE_SETUP.md](FIRESTORE_SETUP.md): Firestore index setup guide
- [SECURITY.md](SECURITY.md): Security and data isolation details
- [docs/blueprint.md](docs/blueprint.md): App design and feature blueprint

---

## ✨ UI/UX

- **Primary Color**: #29ABE2 (Vivid Blue)
- **Accent Color**: #79D1C3 (Turquoise)
- **Fonts**: 'Poppins' for headlines, 'PT Sans' for body
- **Modern, card-based layout** with smooth transitions and mobile-first design

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Genkit](https://github.com/genkit-dev/genkit)
- [Google Gemini AI](https://ai.google.dev/gemini)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

> _BillQuick AI: Smart, simple, and insightful billing for your shop._
