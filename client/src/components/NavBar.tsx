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
    navigate(`/${e.key}`);
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
        Dashboard
      </Menu.Item>
      <Menu.Item key="partners" icon={<TeamOutlined />}>
        Partners
      </Menu.Item>
      <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
        Orders
      </Menu.Item>
      <Menu.Item key="history" icon={<FileTextOutlined />}>
        History
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
