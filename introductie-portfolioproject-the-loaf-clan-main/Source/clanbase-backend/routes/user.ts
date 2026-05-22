import jsonResponse from "../components/responses";
import DbConnect from "../components/db";
import { validateToken } from "../components/jwt";
import jwt from "jsonwebtoken";
import type { FieldPacket, OkPacket, RowDataPacket } from "mysql2";

const SECRET_KEY = "your_secret_key";
const dbConnect = new DbConnect();


export async function userRoutes(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (url.pathname === "/available-users") {
        if (method !== "GET") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        const authHeaderAvailableUsers = req.headers.get("Authorization");
        if (!authHeaderAvailableUsers) {
            return jsonResponse({ message: "No authorization header provided" }, 401);
        }

        const tokenAvailableUsers = authHeaderAvailableUsers.split(' ')[1];
        if (!tokenAvailableUsers) {
            return jsonResponse({ message: "Token missing" }, 401);
        }

        try {
            const decoded = jwt.verify(tokenAvailableUsers, SECRET_KEY);

            if (typeof decoded !== 'string' && 'userId' in decoded) {
                console.log("Decoded token:", decoded);

                // Fetch all users excluding the team leader and users already in a team
                const [availableUsers] = await dbConnect.executeQuery(
                    `
SELECT id, username, email FROM users 
WHERE id NOT IN (
    SELECT user_id FROM user_team
) AND id != ?
`,
                    [decoded.userId]
                ) as [RowDataPacket[], FieldPacket[]];

                return jsonResponse({ message: "Available users fetched successfully", users: availableUsers }, 200);
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            console.error("Error during token validation or fetching users:", error);
            return jsonResponse({ message: "Invalid or expired token" }, 401);
        }
    }

    if (url.pathname === "/profile") {
        if (method !== "GET") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        // Extract the Authorization header value
        const authHeaderProfile = req.headers.get("Authorization");

        // Pass the header value to validateToken
        const tokenPayload = validateToken(authHeaderProfile);

        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
        }

        const { userId } = tokenPayload;

        try {
            // Fetch user profile with team name
            const result = await dbConnect.executeQuery(
                `SELECT 
                  users.username, 
                  users.age, 
                  users.email, 
                  users.gamepreference, 
                  users.user_role, 
                  teams.team_name
               FROM users
               LEFT JOIN user_team ON users.id = user_team.user_id
               LEFT JOIN teams ON user_team.team_id = teams.team_id
               WHERE users.id = ?`,
                [userId]
            );

            const [rows] = result as [RowDataPacket[], FieldPacket[]];

            if (rows.length === 0) {
                return jsonResponse({ message: "User not found" }, 404);
            }

            const user = rows[0];

            // Return the user profile with team name
            return jsonResponse(
                {
                    message: "Profile fetched successfully",
                    user,
                },
                200
            );
        } catch (error) {
            console.error("Error fetching profile:", error);
            return jsonResponse({ message: "Internal server error" }, 500);
        }
    }

    return jsonResponse({ message: "Route not found" }, 404);
}