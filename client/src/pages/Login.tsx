import { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Login = () => {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('AuthContext is not defined');
  }

  const [role, setRole] = useState<string>('partner');
  const { login } = authContext;
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      const endpoint =
        role === 'partner'
          ? `${import.meta.env.VITE_API_URL}/auth/login-partner`
          : `${import.meta.env.VITE_API_URL}/auth/login-manager`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data.token);
      message.success('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Failed to login:', error);
      message.error('Login failed');
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")){
      navigate("/");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form
        name="login"
        onFinish={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        layout="vertical"
      >
        {/* Role Selection */}
        <Form.Item
          name="role"
          label="Login As"
          initialValue="partner"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select onChange={setRole}>
            <Option value="partner">Partner</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
