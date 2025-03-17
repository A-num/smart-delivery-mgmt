import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';
import { useEffect } from 'react';


const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("manager")) {
        navigate("/managerDashboard");
      } else {
        navigate("/partnerDashboard");;
      }
    }
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Smart Delivery Management</h1>
        <p>
          Efficiently manage orders and delivery partners with real-time
          tracking and seamless order assignment.
        </p>
        <div className="home-buttons">
          <button onClick={() => navigate("/login")} className="btn-primary">
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="btn-secondary"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
