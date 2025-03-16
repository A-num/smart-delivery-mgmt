# Smart Delivery Management System  

A **MERN (MongoDB, Express.js, React, Node.js)** based system for managing delivery partners and orders with real-time order tracking, partner availability, and shift scheduling.  

---

##  **Features**  
✅ **Authentication** – Partner and Manager login using JWT.  
✅ **Partner Dashboard** – Key metrics, active orders, availability toggle, shift scheduling, and profile editing.  
✅ **Manager Dashboard** – Partner list, order tracking, order creation, and performance metrics.  
✅ **Order Assignment** – Based on partner availability, area priority, and load.  
✅ **Drag-and-Drop Priority** – Set area priority using `@dnd-kit`.  

---

##  **Tech Stack**  
**Frontend:** React, TypeScript, Ant Design  
**Backend:** Express.js, MongoDB, Mongoose  
**Auth:** JWT, bcrypt  
**State:** Context API  
**Styling:** CSS, Ant Design  

---

##  **Folder Structure**  
```
smart-delivery-mgmt/
├── client/                  # Frontend
│   ├── src/                 # Source code
│   ├── public/              # Static files
├── server/                  # Backend
│   ├── src/                 # Source code
├── .env                     # Environment variables
├── README.md                # Project documentation
```

---

##  **Setup**  
1. **Clone the repository**  
```bash
git clone https://github.com/your-username/smart-delivery-mgmt.git
```

2. **Install dependencies**  
```bash
cd client && npm install  
cd ../server && npm install  
```

3. **Set up `.env` files**  

4. **Start the project**  
```bash
# Backend
npm run dev
# Frontend
npm run dev
```

##  **Order Assignment Logic**  
1. Partner must be **active** and under load limit.  
2. Order time must be within partner’s shift.  
3. Higher-priority areas are assigned first.  
4. Higher-rated partner gets priority.  

---

##  **Deployment**    
- **Database:** MongoDB Atlas   

---