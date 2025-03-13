import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AppProvider } from "./context/AppContext";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";
import  PartnerDashboard  from "./pages/Partner/PartnerDashboard";
import Partners from "./pages/Partners";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
              } >
                <Route path="partners" element={<Partners />} />
                <Route path="/orders" element={<Orders />} />
              </Route>
              <Route
                path="/partnerDashboard"
                element={
                  <ProtectedRoute>
                    <PartnerDashboard/>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
          <Loading />
        </AppProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;
