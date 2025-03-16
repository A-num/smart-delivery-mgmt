import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>('partner');

  const handleSubmit = async (values: any) => {
    try {
      const endpoint =
        role === 'partner'
          ? `${import.meta.env.VITE_API_URL}/api/auth/register-partner`
          : `${import.meta.env.VITE_API_URL}/api/auth/register-manager`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to register');

      message.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      message.error('Failed to register');
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form
        name="register"
        onFinish={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        layout="vertical"
      >
        {/* Role Selection */}
        <Form.Item
          name="role"
          label="Register As"
          initialValue="partner"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select onChange={setRole}>
            <Option value="partner">Partner</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Invalid email address' },
          ]}
        >
          <Input />
        </Form.Item>

        {role === 'partner' && (
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits' },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        {/* Common Password Field */}
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Register
          </Button>
        </Form.Item>
      </Form>
      <div className="register-link-container">
        <p>
          Already Signed Up?<Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
