const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      imageUrl TEXT,
      stock INTEGER DEFAULT 0
    )`);

    // Cart table
    db.run(`CREATE TABLE IF NOT EXISTS cart (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id)
    )`);

    // Check if products table is empty and seed it
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (err) {
        console.error("Error checking products:", err);
      } else if (row.count === 0) {
        seedProducts();
      }
    });
  });
}

// Seed initial products
function seedProducts() {
  const products = [
    {
      name: "Laptop",
      price: 82999,
      description: "High-performance laptop with 16GB RAM and 512GB SSD",
      imageUrl:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=400&fit=crop",
      stock: 10,
    },
    {
      name: "Wireless Mouse",
      price: 2499,
      description: "Ergonomic wireless mouse with long battery life",
      imageUrl:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop",
      stock: 50,
    },
    {
      name: "Mechanical Keyboard",
      price: 6639,
      description: "RGB mechanical keyboard with Cherry MX switches",
      imageUrl:
        "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=400&fit=crop",
      stock: 30,
    },
    {
      name: "4K Monitor",
      price: 20749,
      description: "27-inch 4K UHD monitor with HDR support",
      imageUrl:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=400&fit=crop",
      stock: 15,
    },
    {
      name: "USB-C Hub",
      price: 4149,
      description: "7-in-1 USB-C hub with HDMI and card reader",
      imageUrl:
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop",
      stock: 25,
    },
    {
      name: "Gaming Headset",
      price: 7469,
      description: "Wireless gaming headset with 7.1 surround sound",
      imageUrl:
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=400&fit=crop",
      stock: 20,
    },
  ];

  const stmt = db.prepare(
    "INSERT INTO products (id, name, price, description, imageUrl, stock) VALUES (?, ?, ?, ?, ?, ?)"
  );

  products.forEach((product) => {
    const id = uuidv4();
    stmt.run(
      id,
      product.name,
      product.price,
      product.description,
      product.imageUrl,
      product.stock
    );
  });

  stmt.finalize();
  console.log("Products seeded successfully");
}

// Products API Routes
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(row);
    }
  });
});

// Cart API Routes
app.get("/api/cart", (req, res) => {
  db.all(
    `SELECT c.*, p.name, p.price, p.imageUrl, p.stock 
          FROM cart c 
          JOIN products p ON c.productId = p.id`,
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/api/cart", (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  // Check if product exists and has stock
  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Check if item already in cart
    db.get(
      "SELECT * FROM cart WHERE productId = ?",
      [productId],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (existing) {
          // Update quantity
          const newQuantity = existing.quantity + quantity;
          if (product.stock < newQuantity) {
            return res.status(400).json({ error: "Insufficient stock" });
          }
          db.run(
            "UPDATE cart SET quantity = ? WHERE productId = ?",
            [newQuantity, productId],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({
                id: existing.id,
                productId,
                quantity: newQuantity,
                message: "Cart updated",
              });
            }
          );
        } else {
          // Add new item to cart
          const id = uuidv4();
          db.run(
            "INSERT INTO cart (id, productId, quantity) VALUES (?, ?, ?)",
            [id, productId, quantity],
            function (err) {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              res.json({
                id,
                productId,
                quantity,
                message: "Item added to cart",
              });
            }
          );
        }
      }
    );
  });
});

app.put("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  // Get the cart item to check product
  db.get("SELECT * FROM cart WHERE id = ?", [id], (err, cartItem) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Check stock
    db.get(
      "SELECT * FROM products WHERE id = ?",
      [cartItem.productId],
      (err, product) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (product.stock < quantity) {
          return res.status(400).json({ error: "Insufficient stock" });
        }

        db.run(
          "UPDATE cart SET quantity = ? WHERE id = ?",
          [quantity, id],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Cart updated" });
          }
        );
      }
    );
  });
});

app.delete("/api/cart/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM cart WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json({ message: "Item removed from cart" });
  });
});

app.delete("/api/cart", (req, res) => {
  db.run("DELETE FROM cart", function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Cart cleared" });
  });
});

// Place order - reduces stock and clears cart
app.post("/api/orders", (req, res) => {
  // Get all cart items first
  db.all("SELECT * FROM cart", (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Process each cart item to update stock
    let processed = 0;
    let hasError = false;

    cartItems.forEach((item) => {
      // Update stock for each product in cart
      db.run(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.productId],
        function (updateErr) {
          if (updateErr) {
            hasError = true;
            if (!res.headersSent) {
              return res.status(500).json({ error: updateErr.message });
            }
          }

          processed++;

          // When all items processed, clear cart
          if (processed === cartItems.length && !hasError) {
            db.run("DELETE FROM cart", (clearErr) => {
              if (clearErr) {
                return res.status(500).json({ error: clearErr.message });
              }
              res.json({
                message: "Order placed successfully",
                processedItems: cartItems.length,
              });
            });
          }
        }
      );
    });
  });
});

// Start server
console.log("Starting server...");
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    "API endpoints available at /api/products, /api/cart, and /api/orders"
  );
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
    process.exit(0);
  });
});
