import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { LoadingContext } from "../../context/LoadingContext";
import { AREAS } from "../../assets/areas";
import { Button, Form, Input, Select, TimePicker } from "antd";
const { Option } = Select;

const Orders = () => {
  const context = useContext(AppContext);
  const loadingContext = useContext(LoadingContext);
  if (!context) return null;
  const {fetchOrders } = context;

  const [itemQuantity, setItemQuantity] = useState<Number>(0);
  const [itemPrice, setItemPrice] = useState<Number>(0);
  const [totalAmount, setTotalAmount] = useState<Number>(0);

  const handleSubmit = async (values: any) => {
    try {
      /**
       if items list in future form:
       values.totalAmount = 0;
       values.items.forEach((item) => values.totalAmount += item.quantity*item.price)
       */
      loadingContext?.showLoading();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: values.customerName,
            phone: values.customerPhone,
            address: values.customerAddress,
          },
          area: values.area,
          items: [{ name: values.itemName, quantity: values.itemQuantity, price: values.itemPrice}],
          status: "pending",
          scheduledFor: values.scheduledFor,
          totalAmount: totalAmount,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order"); 
      }
      else{
        alert("Order Created Successfully")
      }     
      fetchOrders();
    } catch (error) {
      console.error("Failed to create order:", error);
    } finally {
      loadingContext?.hideLoading();
    }
  };

  const handleCalculateTotal = (price: Number, quantity: Number) => {
     if (price != 0 && quantity != 0 ) {
      const amount = Number(quantity) * Number(price);
      setTotalAmount(amount);
    } else {
      console.log("Calculating: set to zero");
      setTotalAmount(0);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form
        onFinish={handleSubmit}
        layout="horizontal"
        className="bg-white p-8 rounded-lg shadow-md w-96"
        style={{ width: "30%" }}
      >
        <Form.Item
          name="customerName"
          label="Customer Name"
          rules={[{ required: true, message: "Customer name is required" }]}
        >
          <Input placeholder="Enter customer name" />
        </Form.Item>
        <Form.Item
          name="customerPhone"
          label="Customer Phone"
          rules={[
            { required: true, message: "Please enter customer phone number" },
          ]}
        >
          <Input placeholder="Enter customer phone number" />
        </Form.Item>
        <Form.Item
          name="customerAddress"
          label="Customer Address"
          rules={[{ required: true, message: "Please enter customer address" }]}
        >
          <Input placeholder="Enter customer address" />
        </Form.Item>
        <Form.Item
          name="area"
          label="Area"
          rules={[{ required: true, message: "Please enter Area" }]}
        >
          <Select
            style={{
              padding: "2px",
              minWidth: "200px",
              maxWidth: "400px",
              margin: "auto",
            }}
            placeholder="Select Area"
            className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {AREAS.map((area) => (
              <Option key={area} value={area}>
                {area}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="itemName"
          label="Item Name"
          rules={[{ required: true, message: "Please enter item name" }]}
        >
          <Input placeholder="Item Name" />
        </Form.Item>
        <Form.Item
          name="itemQuantity"
          label="Item Quantity"
          rules={[{ required: true, message: "Please enter item quantity" }]}
        >
          <Input
            placeholder="Item Quantity"
            value={Number(itemQuantity)}
            onChange={(e) => {
              setItemQuantity(Number(e.target.value));
              handleCalculateTotal(itemPrice, Number(e.target.value));
            }}
          />
        </Form.Item>
        <Form.Item
          name="itemPrice"
          label="Item Price"
          rules={[{ required: true, message: "Please enter item price" }]}
        >
          <Input
            placeholder="Item Price"
            value={Number(itemPrice)}
            onChange={(e) => {
              setItemPrice(Number(e.target.value));
              handleCalculateTotal(Number(e.target.value), itemQuantity);
            }}
          />
        </Form.Item>
        <Form.Item
          name="totalAmount"
          label="Total amount"
        >
          <div>
            <Input
              placeholder="Total Amount"
              value={Number(totalAmount)}
              readOnly
            />
          </div>
        </Form.Item>
        <Form.Item
          name="scheduledFor"
          label="Scheduled For"
          rules={[{ required: true, message: "Please select a time" }]}
        >
          <TimePicker
            format="HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            style={{ alignSelf: "center" }}
          >
            Create Order
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Orders;
