import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AppProvider } from "./context/AppContext";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";
import  PartnerDashboard  from "./pages/Partner/PartnerDashboard";

const App = () => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/partnerDashboard" element={<PartnerDashboard />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </BrowserRouter>
          <Loading />
        </AppProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;
