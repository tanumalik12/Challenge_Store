🌟 Store Rating Platform

A full-stack web application where users can ⭐ rate stores, and admins & store owners can manage the system efficiently.
Built with React.js (frontend), Express.js/Nest.js/Loopback (backend), and PostgreSQL/MySQL (database).

🚀 Features
👨‍💻 Roles & Permissions

System Administrator → Manage users, stores, ratings, and view dashboard analytics.

Normal User → Register, login, browse stores, submit & update ratings.

Store Owner → View their store’s ratings and customers who rated them.

🎯 Highlights

JWT Authentication 🔐

Role-Based Access Control 🛡️

Sorting & Filtering 🔍

Responsive UI 📱

Form Validations ✅


📂 Project Structure
store-rating-platform/


│── backend/                 # Backend code

│── frontend/                # React.js frontend

│── database/                # SQL schema & seed data

│── README.md  

│── package.json 

│── .env.example  

🔹 Backend Setup
cd backend
npm install
cp .env.example .env   # update DB credentials
npm run dev

🔹 Frontend Setup
cd frontend
npm install
npm start

🔹 Database Setup
psql -U <username> -d <dbname> -f database/schema.sql

✔️ Role-based route protection
✔️ Validation on both frontend & backend

👨‍💻 Author

💡 “Code. Build. Learn. Improve.”
