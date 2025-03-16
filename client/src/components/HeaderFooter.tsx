import { Layout, Button } from 'antd';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

const HeaderFooter = ({ children }: { children: React.ReactNode }) => {
  const { logout} = useContext(AuthContext)!;
  const context = useContext(AppContext);
  const partner = context?.partner;
  const manager = context?.manager;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>

      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', width: '100vw' }}>
        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1 }}>
          {partner && (
            <Menu.Item key="2" onClick={() => navigate('/partnerDashboard')}>
               Dashboard
            </Menu.Item>
          )}
          {manager && (
            <Menu.Item key="3" onClick={() => navigate('/managerDashboard')}>
               Dashboard
            </Menu.Item>
          )}
        </Menu> */}

        <h1 style={{color:'#ffffff', fontSize:'35px'}}>Dashboard</h1>

        {(partner || manager) && (
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
