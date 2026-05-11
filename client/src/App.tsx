import { Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/layout/Navbar";

import Books from "./pages/Books";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthProvider from "./context/Auth/AuthProvider";
import CartProvider from "./context/Cart/CartProvider";
import BookDetailsPage from "./pages/BookDetailsPage";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <AuthProvider>
      <CartProvider>
        {!hideNavbar && <NavBar />}

        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/books/:id" element={<BookDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
