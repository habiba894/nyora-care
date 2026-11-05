import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./pages/Home";
import Cart from "./pages/cart";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DMLauncher from "./Components/DMLauncher";

function StoreLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F4EF] text-[#493438]">
      <Navbar />
      {children}
      <Footer />
      <DMLauncher />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        {/* CUSTOMER STORE */}
        <Route
          path="/"
          element={
            <StoreLayout>
              <Home />
            </StoreLayout>
          }
        />

        <Route
          path="/shop"
          element={
            <StoreLayout>
              <Shop />
            </StoreLayout>
          }
        />

        <Route
          path="/wishlist"
          element={
            <StoreLayout>
              <Wishlist />
            </StoreLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <StoreLayout>
              <Cart />
            </StoreLayout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <StoreLayout>
              <ProductDetails />
            </StoreLayout>
          }
        />

        <Route
          path="/checkout"
          element={
            <StoreLayout>
              <Checkout />
            </StoreLayout>
          }
        />

        <Route
          path="/order-success"
          element={
            <StoreLayout>
              <OrderSuccess />
            </StoreLayout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <StoreLayout>
              <NotFound />
            </StoreLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;