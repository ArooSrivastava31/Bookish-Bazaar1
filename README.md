# 📚 Bookish Bazaar

A full-stack web application for buying, selling, and exchanging books. Connect with fellow book lovers, manage your personal library, and discover new reads through our intuitive platform.

![Bookish Bazaar](https://img.shields.io/badge/Bookish-Bazaar-blue?style=for-the-badge&logo=bookstack)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔐 **User Authentication**: Secure signup and login system
- 📖 **Book Management**: Add, view, and manage your book collection
- 🛒 **E-commerce**: Buy books from other users
- 🔄 **Book Exchange**: Request and manage book exchanges
- 💬 **Real-time Chat**: Communicate with other users
- 📦 **Order Management**: Track your purchases and sales
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Optimized for all devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aditya5-cloud/Bookish-Bazaar.git
   cd bookish-baazar
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookish-bazaar
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Run the application**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
bookish-baazar/
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookController.js
│   │   ├── chatController.js
│   │   ├── exchangeController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Book.js
│   │   ├── Conversation.js
│   │   ├── exchangeRequest.js
│   │   ├── Message.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── books.js
│   │   ├── chat.js
│   │   ├── exchanges.js
│   │   └── orders.js
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── BookCard.js
│   │   │   ├── Carousel.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AddBook.js
│   │   │   ├── AllBooks.js
│   │   │   ├── BookDetails.js
│   │   │   ├── Chat.js
│   │   │   ├── Checkout.js
│   │   │   ├── ExchangeRequests.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── MyBooks.js
│   │   │   ├── MyOrders.js
│   │   │   └── Signup.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders

### Exchanges
- `POST /api/exchanges` - Request exchange
- `GET /api/exchanges/my-requests` - Get user's exchange requests

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send message

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Aditya** - *Initial work* - [Aditya5-cloud](https://github.com/Aditya5-cloud)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by the love for books and community sharing
- Built with ❤️ using modern web technologies

---

⭐ **Star this repo** if you found it helpful! 
