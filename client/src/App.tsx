import { BrowserRouter, Routes, Route } from "react-router-dom";
import Orders from "./pages/Order/Orders";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AppProvider } from "./context/AppContext";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";
import  PartnerDashboard  from "./pages/Partner/PartnerDashboard";
import Partners from "./pages/Manager/Partners";
import Layout from "./components/Layout";
import PartnerProtectedRoute from "./components/PartnerProtectedRoute";
import ManagerProtectedRoute from "./components/ManagerProtectedRoute";
import HeaderFooter from "./components/HeaderFooter";


const App = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppProvider>
          <BrowserRouter>
          <HeaderFooter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

             <Route path="/managerDashboard" element={
                  <ManagerProtectedRoute>
                    <Layout />
                  </ManagerProtectedRoute>
              } >
                <Route path="partners" element={<Partners />} />
                <Route path="orders" element={<Orders />} />
              </Route>

             <Route
                path="/partnerDashboard"
                element={
                  <PartnerProtectedRoute>
                    <PartnerDashboard/>
                  </PartnerProtectedRoute>
                }
              />
            </Routes>
            </HeaderFooter>
          </BrowserRouter>
          <Loading />
        </AppProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;
