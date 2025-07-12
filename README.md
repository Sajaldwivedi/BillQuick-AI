# 📦 BillQuick – Smart Billing & Inventory App for Local Shops

BillQuick is a lightweight web/mobile app designed for local shopkeepers to manage their billing and inventory digitally. With a simple interface, real-time stock tracking, and AI-powered sales insights, it helps small businesses streamline daily operations — replacing paper slips and manual errors with professional tools.

---

## 🚀 Features

- 📄 **Digital Bill Generator**  
  Generate clean, professional invoices with line items and total amount. Download as PDF or share via WhatsApp.

- 📦 **Inventory Management**  
  Add/edit/delete products, and automatically reduce stock levels when a bill is generated.

- 📊 **AI-Powered Sales Insights** *(Google Gemini)*  
  Analyze recent bills to identify the top-selling items and generate weekly summaries.

- 🔐 **Secure Authentication**  
  Firebase Auth provides secure login for shopkeepers.

- 📱 **Mobile-Optimized UI**  
  Clean, responsive dashboard built with React.js, optimized for small screens.

---

## 🛠 Tech Stack

| Component         | Technology                      |
|------------------|----------------------------------|
| Frontend         | React.js (Google IDX)            |
| Auth             | Firebase Authentication          |
| Database         | Firestore                        |
| File Storage     | Firebase Storage                 |
| Hosting          | Firebase Hosting                 |
| AI Integration   | Google Gemini / Vertex AI        |
| PDF Generation   | pdf-lib                          |

---

## 📁 Project Structure

```bash
billquick/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── firebase.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md

# Clone the repository
git clone https://github.com/your-username/billquick.git
cd billquick

# Install dependencies
npm install

# Set up your Firebase config in `.env` file
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...

# Start the development server
npm start
