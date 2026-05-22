import jsonResponse from "../components/responses";
import DbConnect from "../components/db";
import { validateToken } from "../components/jwt";
import jwt from "jsonwebtoken";
import type { FieldPacket, OkPacket, RowDataPacket } from "mysql2";

const SECRET_KEY = "your_secret_key";
const dbConnect = new DbConnect();

export async function NotificationRoute(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (url.pathname === "/send-invite") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }
    
        const { targetUserIds } = await req.json(); // Expect an array of user IDs
        if (!Array.isArray(targetUserIds) || targetUserIds.length === 0) {
            return jsonResponse({ message: "Invalid or missing target user IDs." }, 400);
        }
    
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
        }
    
        const { userId } = tokenPayload;
    
        try {
            // Fetch the team_id of the user sending the invite
            const teamResult = await dbConnect.executeQuery(
                `SELECT teams.team_id 
                 FROM teams
                 JOIN user_team ON teams.team_id = user_team.team_id
                 WHERE user_team.user_id = ? AND user_team.team_role = 'team_leader'`,
                [userId]
            );
    
            const [teamRows] = teamResult as [RowDataPacket[], FieldPacket[]];
    
            if (!teamRows.length) {
                return jsonResponse({ message: "You are not a team leader or no team found." }, 400);
            }
    
            const teamId = teamRows[0].team_id;
    
            // Insert notifications for all target user IDs
            const insertPromises = targetUserIds.map((targetUserId) =>
                dbConnect.executeQuery(
                    `INSERT INTO notifications (user_id, type, team_id) VALUES (?, 'team_invite', ?)`,
                    [targetUserId, teamId]
                )
            );
    
            await Promise.all(insertPromises); // Execute all insert queries concurrently
    
            return jsonResponse({ message: "Team invites sent successfully." }, 200);
        } catch (error) {
            console.error("Error sending invites:", error);
            return jsonResponse({ message: "Internal server error" }, 500);
        }
    }
    

    if (url.pathname === "/notifications") {
        if (method !== "GET") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }
    
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
        }
    
        const { userId } = tokenPayload;
    
        try {
            const result = await dbConnect.executeQuery(
                `SELECT notifications.id, notifications.type, notifications.status, teams.team_name
                 FROM notifications 
                 LEFT JOIN teams ON notifications.team_id = teams.team_id
                 WHERE notifications.user_id = ? AND notifications.status = 'pending'`,
                [userId]
            );
    
            const [rows] = result as [RowDataPacket[], FieldPacket[]];
    
            if (!rows.length) {
                return jsonResponse({ notifications: [] }, 200); // Return empty array for consistency
            }
    
            return jsonResponse({ notifications: rows }, 200);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return jsonResponse({ message: "Internal server error" }, 500);
        }
    }
    
    
    if (url.pathname === "/respond-invite") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }
    
        const { notificationId, response } = await req.json();
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
        }
    
        const { userId } = tokenPayload;
    
        try {
            // Check if the user is already in a team
            const userTeamCheck = await dbConnect.executeQuery(
                `SELECT team_id FROM user_team WHERE user_id = ?`,
                [userId]
            );
    
            const [userTeamRows] = userTeamCheck as [RowDataPacket[], FieldPacket[]];
    
            if (userTeamRows.length > 0) {
                return jsonResponse(
                    { message: "You are already part of a team and cannot accept another invite." },
                    400
                );
            }
    
            // Fetch the team_id from the notification
            const teamResult = await dbConnect.executeQuery(
                `SELECT team_id FROM notifications WHERE id = ? AND user_id = ?`,
                [notificationId, userId]
            );
    
            const [teamRows] = teamResult as [RowDataPacket[], FieldPacket[]];
    
            if (!teamRows.length) {
                return jsonResponse({ message: "Notification not found or not authorized." }, 404);
            }
    
            const teamId = teamRows[0].team_id;
    
            // If the response is "accepted", add the user to the team
            if (response === "accepted") {
                await dbConnect.executeQuery(
                    `INSERT INTO user_team (user_id, team_id) VALUES (?, ?)`,
                    [userId, teamId]
                );
            }
    
            // Delete the notification after processing the response
            await dbConnect.executeQuery(
                `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
                [notificationId, userId]
            );
    
            return jsonResponse({ message: "Response recorded and notification deleted successfully." }, 200);
        } catch (error) {
            console.error("Error responding to invite:", error);
            return jsonResponse({ message: "Internal server error" }, 500);
        }
    }
    
    return jsonResponse({ message: "Route not found" }, 404);
    
}
