import { Route, Routes, useLocation } from "react-router-dom";

import NavBar from "./components/layout/Navbar";

import Books from "./pages/Books";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthProvider from "./context/Auth/AuthProvider";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <AuthProvider>
      {!hideNavbar && <NavBar />}

      <Routes>
        <Route path="/" element={<Books />} />
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
    </AuthProvider>
  );
}

export default App;
