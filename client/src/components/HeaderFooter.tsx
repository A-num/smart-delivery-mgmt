import { Layout, Button } from 'antd';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

const HeaderFooter = ({ children }: { children: React.ReactNode }) => {
  const { logout} = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register" || location.pathname === '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', width: '100vw' }}>

        <h2 style={{color:'#ffffff'}}>Smart Delivery Management</h2>

        {!isAuthPage && (
          <Button type="primary"  onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Header>

      <Content style={{ padding: '20px' }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Smart Delivery Management System ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default HeaderFooter;
