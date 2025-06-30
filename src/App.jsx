// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
// Import ToastContainer and its CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          {/* ToastContainer should be placed where it can render messages */}
          <ToastContainer
            position="top-right" // or "bottom-center", "top-left", etc.
            autoClose={5000} // Duration in milliseconds
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" // or "dark", "colored"
          />

          {/* Optional: Navbar, Footer etc. */}
          <Navbar />
          <main className="app-main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;