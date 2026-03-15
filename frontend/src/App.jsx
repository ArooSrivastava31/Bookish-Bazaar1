import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllBooks from './pages/AllBooks';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
import MyBooks from './pages/MyBooks';
import ExchangeRequests from './pages/ExchangeRequests';
import Chat from './pages/Chat';
import PrivateRoute from './components/PrivateRoute';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

function App() {
  return (
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/books" element={<AllBooks />} />
              <Route path="/book/:id" element={<BookDetails />} />
              
              {/* --- Protected Routes --- */}
              <Route element={<PrivateRoute />}>
                <Route path="/add-book" element={<AddBook />} />
                <Route path="/my-books" element={<MyBooks />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/checkout/:bookId" element={<Checkout />} />
                <Route path="/exchange-requests" element={<ExchangeRequests />} />
                <Route path="/chat/:id" element={<Chat />} />
              </Route>
              {/* --- End Protected Routes --- */}

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;

