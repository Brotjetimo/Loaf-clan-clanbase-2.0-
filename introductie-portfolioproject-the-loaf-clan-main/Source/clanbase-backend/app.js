import { serve } from "bun";
import mysql from "mysql2/promise"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// MySQL database connection settings
const dbConfig = {
  host: "localhost",
  user: "root", 
  password: "", 
  database: "loaf-clan", 
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// JWT secret key
const secret = "your_jwt_secret";

serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Register route
    if (url.pathname === "/api/register" && req.method === "POST") {
      return req.json().then(async ({ username, password }) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Insert the new user into the database
        try {
          const [result] = await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
          return new Response("User registered", { status: 201 });
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return new Response("Username already exists", { status: 400 });
          }
          return new Response("Internal Server Error", { status: 500 });
        }
      });
    }

    // Login route
    if (url.pathname === "/api/login" && req.method === "POST") {
      return req.json().then(async ({ username, password }) => {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        
        if (rows.length > 0) {
          const user = rows[0];
          if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username }, secret, { expiresIn: "1h" });
            return new Response(JSON.stringify({ token }), {
              headers: { "Content-Type": "application/json" },
            });
          }
        }
        
        return new Response("Invalid credentials", { status: 401 });
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("Server running on http://localhost:3000");
