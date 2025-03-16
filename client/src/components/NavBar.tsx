import { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('dashboard');

  const handleClick = (e: any) => {
    setCurrentTab(e.key);
    navigate(`/managerDashboard/${e.key}`);
  };

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[currentTab]}
      mode="horizontal"
      theme="light"
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 500,
      }}
    >
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
       Orders Dashboard
      </Menu.Item>
      <Menu.Item key="partners" icon={<TeamOutlined />}>
        Partners
      </Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        Create Order
      </Menu.Item>
      <Menu.Item key="history" icon={<FileTextOutlined />}>
        Assignment History
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
