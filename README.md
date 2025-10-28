# 🛒 Mock E-Commerce Cart

A full-stack e-commerce shopping cart application with React frontend and Express/Node.js backend.

## ✨ Features

- **Product Catalog**: Browse available products with real-time stock information
- **Smart Cart Integration**: Product cards show "Added to Cart" status with current quantity
- **Quick Quantity Increase**: Add more items directly from product cards
- **Shopping Cart**: Add, update, and remove items from your cart
- **Real-time Updates**: Cart updates instantly reflect product availability
- **Stock Management**: Prevents adding more items than available in stock
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Search & Filter**: Search products and filter by price range
- **Auto-close Cart**: Cart automatically closes after successful order placement
- **RESTful API**: Clean, well-structured backend API

## 🏗️ Tech Stack

### Frontend

- React 19
- Vite
- Modern CSS with gradients and animations

### Backend

- Node.js
- Express.js
- SQLite database
- CORS enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- npm or yarn

### Installation & Running

**1. Install dependencies**

For backend:
```bash
cd backend
npm install
```

For frontend:
```bash
cd frontend
npm install
```

**2. Start the Backend Server**

Open a terminal and run:
```bash
cd backend
npm start
```

Backend runs on `http://localhost:3000`

**3. Start the Frontend (in a new terminal)**

Open another terminal and run:
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

**4. Open your browser** and navigate to `http://localhost:5173`

### Quick Start (PowerShell/Windows)

Run both servers in separate terminals:

Terminal 1:
```powershell
cd backend
npm start
```

Terminal 2:
```powershell
cd frontend
npm run dev
```

## 📁 Project Structure

```
mock-ecommerce-cart/
├── backend/
│   ├── index.js          # Express server and API routes
│   ├── database.sqlite   # SQLite database (auto-created)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   └── Cart.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart

- `GET /api/cart` - Get all cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

## 🎨 Features in Detail

### Product Display

- Product cards with images, descriptions, and pricing
- Real-time stock display
- Smart cart status indicators
- Out-of-stock indicators
- **Cart Status Display**: Products show "✓ Added to Cart (quantity)" when in cart
- **Quick Add More**: Increase quantity button visible on product cards when item is in cart

### Shopping Cart

- Slide-out drawer interface
- Update item quantities using +/- buttons
- Remove individual items
- Clear entire cart
- Real-time total calculation
- Stock validation
- **Auto-close**: Cart drawer closes automatically after successful order placement

## 🎯 Future Enhancements

Potential features to add:

- User authentication
- Order history
- Product search and filtering
- Product categories
- Payment integration
- Admin panel for product management
- Reviews and ratings
- Wishlist functionality

## 📝 License

ISC

## 👨‍💻 Development

### Adding New Products

Products are seeded automatically on first run. To add more products, you can either:

1. Manually insert into the database
2. Create an admin API endpoint
3. Modify the seedProducts() function in `backend/index.js`

### Database Schema

**Products Table**

- id (TEXT, PRIMARY KEY)
- name (TEXT)
- price (REAL)
- description (TEXT)
- imageUrl (TEXT)
- stock (INTEGER)

**Cart Table**

- id (TEXT, PRIMARY KEY)
- productId (TEXT, FOREIGN KEY)
- quantity (INTEGER)

## 🐛 Troubleshooting

**Port already in use**

- Backend: Change PORT in backend/index.js (default: 3000) or use environment variable
- Frontend: Vite will automatically suggest a different port (default: 5173)

**Database errors**

- Delete `backend/database.sqlite` and restart the server
- The database will be recreated automatically with sample data

**CORS errors**

- Ensure backend is running on port 3000
- Check CORS configuration in backend/index.js

**Product cards not showing "Added to Cart" status**

- Clear browser cache and refresh the page
- Check that both frontend and backend servers are running

## 📸 Screenshots

Screenshots coming soon! The app features:
- Beautiful gradient background with product cards
- Slide-out cart drawer
- Cart status indicators on product cards
- Search and filter functionality
