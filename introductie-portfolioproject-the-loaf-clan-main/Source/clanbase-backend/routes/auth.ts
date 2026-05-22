import jsonResponse from "../components/responses";
import DbConnect from "../components/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { FieldPacket, OkPacket, RowDataPacket } from "mysql2";


const SECRET_KEY = "your_secret_key";
const dbConnect = new DbConnect();

export async function authRoutes(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (url.pathname === "/login") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        const { username, password } = await req.json();
        if (!username || !password) {
            return jsonResponse({ message: "Username and password are required" }, 400);
        }

        const result = await dbConnect.executeQuery(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        const [rows] = result as [RowDataPacket[], FieldPacket[]];
        if (rows.length === 0) {
            return jsonResponse({ message: "Invalid credentials" }, 401);
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                SECRET_KEY
            );
            return jsonResponse({ message: "Login successful", token }, 200);
        }

        return jsonResponse({ message: "Invalid credentials" }, 401);
    }

    if (url.pathname === "/signup") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        const { username, password, newAge, newEmail, newGamePreference } = await req.json();
        if (!username || !password || !newAge || !newEmail) {
            return jsonResponse({ message: "All fields are required" }, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            await dbConnect.executeQuery(
                "INSERT INTO users (username, password, age, email, gamepreference) VALUES (?, ?, ?, ?, ?)",
                [username, hashedPassword, newAge, newEmail, newGamePreference || null]
            );
            return jsonResponse({ message: "User created successfully" }, 201);
        } catch (error) {
            console.error("Signup error:", error);
            return jsonResponse({ message: "Error creating user" }, 500);
        }
    }

    return jsonResponse({ message: "Route not found" }, 404);
}
