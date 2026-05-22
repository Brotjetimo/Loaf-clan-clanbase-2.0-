import jsonResponse from "../components/responses";
import DbConnect from "../components/db";
import { validateToken } from "../components/jwt";
import jwt from "jsonwebtoken";
import type { FieldPacket, OkPacket, RowDataPacket } from "mysql2";

const SECRET_KEY = "your_secret_key";
const dbConnect = new DbConnect();


export async function teamRoutes(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (url.pathname === "/create-team") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        const authHeaderCreateTeam = req.headers.get("Authorization");
        if (!authHeaderCreateTeam) {
            return jsonResponse({ message: 'No authorization header provided' }, 401);
        }

        const tokenCreateTeam = authHeaderCreateTeam.split(' ')[1];
        if (!tokenCreateTeam) {
            return jsonResponse({ message: 'Token missing' }, 401);
        }

        try {
            const decoded = jwt.verify(tokenCreateTeam, SECRET_KEY);

            if (typeof decoded !== 'string' && 'userId' in decoded) {
                console.log("Decoded token:", decoded);

                // Check if the user is already in a team
                const [existingTeams] = await dbConnect.executeQuery(
                    "SELECT * FROM user_team WHERE user_id = ?",
                    [decoded.userId]
                ) as [RowDataPacket[], FieldPacket[]];

                if (existingTeams.length > 0) {
                    return jsonResponse({ message: "You are already part of a team and cannot create another" }, 403);
                }

                const { teamName } = await req.json();
                if (!teamName) {
                    return jsonResponse({ message: "Team name is required" }, 400);
                }

                // Begin team creation transaction
                await dbConnect.executeQuery("START TRANSACTION");

                // Insert team into teams table
                const [teamResult] = await dbConnect.executeQuery(
                    "INSERT INTO teams (team_name) VALUES (?)",
                    [teamName]
                ) as [OkPacket, FieldPacket[]];

                const teamId = teamResult.insertId;

                // Assign the creator as team leader in the user_team table
                await dbConnect.executeQuery(
                    "INSERT INTO user_team (user_id, team_id, team_role) VALUES (?, ?, ?)",
                    [decoded.userId, teamId, 'team_leader']
                );

                // Commit the transaction
                await dbConnect.executeQuery("COMMIT");

                return jsonResponse({ message: "Team created successfully", teamId }, 201);
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            console.error("Error during token validation or team creation:", error);
            return jsonResponse({ message: "Invalid or expired token" }, 401);
        }
    }

    if (url.pathname === "/add-user-to-team") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        const authHeaderAddUser = req.headers.get("Authorization");
        if (!authHeaderAddUser) {
            return jsonResponse({ message: "No authorization header provided" }, 401);
        }

        const tokenAddUser = authHeaderAddUser.split(' ')[1];
        if (!tokenAddUser) {
            return jsonResponse({ message: "Token missing" }, 401);
        }

        try {
            const decoded = jwt.verify(tokenAddUser, SECRET_KEY);

            if (typeof decoded !== 'string' && 'userId' in decoded) {
                console.log("Decoded token:", decoded);

                const { userIdToAdd } = await req.json();
                console.log("Received userIdToAdd:", userIdToAdd); // Log the user ID to check if it's coming through

                if (!userIdToAdd) {
                    return jsonResponse({ message: "User ID to add is required" }, 400);
                }

                // Prevent adding oneself
                if (decoded.userId === userIdToAdd) {
                    return jsonResponse({ message: "You cannot add yourself to a team" }, 400);
                }

                // Check if the requesting user is a team leader
                const [leaderTeams] = await dbConnect.executeQuery(
                    `SELECT team_id FROM user_team WHERE user_id = ? AND team_role = 'team_leader'`,
                    [decoded.userId]
                ) as [RowDataPacket[], FieldPacket[]];

                if (leaderTeams.length === 0) {
                    return jsonResponse({ message: "You are not a team leader" }, 403);
                }

                const teamId = leaderTeams[0].team_id;

                // Check if the user to add is already in a team
                const [existingTeams] = await dbConnect.executeQuery(
                    "SELECT * FROM user_team WHERE user_id = ?",
                    [userIdToAdd]
                ) as [RowDataPacket[], FieldPacket[]];

                if (existingTeams.length > 0) {
                    return jsonResponse({ message: "This user is already in a team" }, 403);
                }

                // Add the user to the team
                await dbConnect.executeQuery(
                    "INSERT INTO user_team (user_id, team_id, team_role) VALUES (?, ?, ?)",
                    [userIdToAdd, teamId, 'teamate']
                );

                return jsonResponse({ message: "User added to team successfully" }, 201);
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            console.error("Error during token validation or adding user:", error);
            return jsonResponse({ message: "Invalid or expired token" }, 401);
        }
    }

    if (url.pathname === "/kick-user") {
        if (method !== "POST") {
            return jsonResponse({ message: "Wrong method used" }, 400);
        }

        const authHeaderKickUser = req.headers.get("Authorization");
        if (!authHeaderKickUser) {
            return jsonResponse({ message: "No authorization header provided" }, 401);
        }

        const tokenKickUser = authHeaderKickUser.split(' ')[1];
        if (!tokenKickUser) {
            return jsonResponse({ message: "Token missing" }, 401);
        }

        try {
            const decoded = jwt.verify(tokenKickUser, SECRET_KEY);

            if (typeof decoded !== 'string' && 'userId' in decoded) {
                console.log("Decoded token:", decoded);

                const { userIdToKick } = await req.json();
                console.log("Received userIdToKick:", userIdToKick);

                if (!userIdToKick) {
                    return jsonResponse({ message: "User ID to kick is required" }, 400);
                }

                // Check if the requesting user is a team leader
                const [leaderTeams] = await dbConnect.executeQuery(
                    `SELECT team_id FROM user_team WHERE user_id = ? AND team_role = 'team_leader'`,
                    [decoded.userId]
                ) as [RowDataPacket[], FieldPacket[]];

                if (leaderTeams.length === 0) {
                    return jsonResponse({ message: "You are not a team leader" }, 403);
                }

                const teamId = leaderTeams[0].team_id;

                // Check if the user to kick is in the same team
                const [teamMembership] = await dbConnect.executeQuery(
                    "SELECT * FROM user_team WHERE user_id = ? AND team_id = ?",
                    [userIdToKick, teamId]
                ) as [RowDataPacket[], FieldPacket[]];

                if (teamMembership.length === 0) {
                    return jsonResponse({ message: "This user is not in your team" }, 404);
                }

                // Prevent kicking the leader themselves
                if (userIdToKick === decoded.userId) {
                    return jsonResponse({ message: "You cannot kick yourself" }, 400);
                }

                // Remove the user from the team
                await dbConnect.executeQuery(
                    "DELETE FROM user_team WHERE user_id = ? AND team_id = ?",
                    [userIdToKick, teamId]
                );

                return jsonResponse({ message: "User successfully kicked from the team" }, 200);
            } else {
                throw new Error("Invalid token");
            }
        } catch (error) {
            console.error("Error during token validation or kicking user:", error);
            return jsonResponse({ message: "Invalid or expired token" }, 401);
        }
    }



    if (url.pathname === "/team-members") {
        // Handle GET request to fetch team details
        if (method === "GET") {
            const authHeaderTeam = req.headers.get("Authorization");
            const tokenPayloadTeam = validateToken(authHeaderTeam);
    
            if (!tokenPayloadTeam) {
                return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
            }
    
            const { userId: userIdTeam } = tokenPayloadTeam;
    
            try {
                const result = await dbConnect.executeQuery(
                    `SELECT 
                    users.id,
                    users.username,
                    user_team.team_role,
                    teams.team_name
                 FROM users
                 LEFT JOIN user_team ON users.id = user_team.user_id
                 LEFT JOIN teams ON user_team.team_id = teams.team_id
                 WHERE user_team.team_id = (
                   SELECT team_id 
                   FROM user_team 
                   WHERE user_id = ?
                 )`,
                    [userIdTeam]
                );
    
                const [rows] = result as [RowDataPacket[], FieldPacket[]];
    
                if (rows.length === 0) {
                    return jsonResponse({ message: "No team members found" }, 404);
                }
    
                // Extract team name and member details
                const teamName = rows[0].team_name;
                const members = rows.map((row) => ({
                    userId: row.id,
                    username: row.username,
                    role: row.team_role,
                }));
    
                // Return team details, including the logged-in user's role
                return jsonResponse(
                    {
                        message: "Team members fetched successfully",
                        teamName,
                        members,
                        loggedInUserRole: rows.find((row) => row.id === userIdTeam)?.team_role, // Add logged-in user's role
                    },
                    200
                );
    
            } catch (error) {
                console.error("Error fetching team members:", error);
                return jsonResponse({ message: "Internal server error" }, 500);
            }
        }

        // Handle POST request to leave a team
        if (method === "POST" && url.searchParams.get("action") === "leave-team") {
            const authHeaderTeam = req.headers.get("Authorization");
            const tokenPayloadTeam = validateToken(authHeaderTeam);

            if (!tokenPayloadTeam) {
                return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
            }

            const { userId: userIdTeam } = tokenPayloadTeam;

            try {
                await dbConnect.executeQuery(
                    `DELETE FROM user_team 
                     WHERE user_id = ?`,
                    [userIdTeam]
                );

                return jsonResponse({ message: "You have successfully left the team" }, 200);
            } catch (error) {
                console.error("Error leaving the team:", error);
                return jsonResponse({ message: "Internal server error" }, 500);
            }
        }

        if (method === "POST" && url.searchParams.get("action") === "delete-team") {
            const authHeaderTeam = req.headers.get("Authorization");
            const tokenPayloadTeam = validateToken(authHeaderTeam);
    
            if (!tokenPayloadTeam) {
                return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
            }
    
            const { userId: userIdTeam } = tokenPayloadTeam;
    
            try {
                // Fetch the team ID of the current user
                const teamCheck = await dbConnect.executeQuery(
                    `SELECT team_id 
                     FROM user_team 
                     WHERE user_id = ?`,
                    [userIdTeam]
                );
    
                const [teamCheckRows] = teamCheck as [RowDataPacket[], FieldPacket[]];
    
                if (teamCheckRows.length === 0) {
                    return jsonResponse({ message: "No team found for the user" }, 404);
                }
    
                const teamId = teamCheckRows[0].team_id;
    
                // Check if the user is the team leader (only the leader can delete the team)
                const teamRoleCheck = await dbConnect.executeQuery(
                    `SELECT team_role 
                     FROM user_team 
                     WHERE team_id = ? AND user_id = ?`,
                    [teamId, userIdTeam]
                );
    
                const [roleCheckRows] = teamRoleCheck as [RowDataPacket[], FieldPacket[]];
    
                if (roleCheckRows.length === 0 || roleCheckRows[0].team_role !== "team_leader") {
                    return jsonResponse({ message: "Only the team leader can delete the team" }, 403);
                }
    
                // Delete all team members before deleting the team itself
                await dbConnect.executeQuery(
                    `DELETE FROM user_team WHERE team_id = ?`,
                    [teamId]
                );
    
                // Now delete the team itself
                await dbConnect.executeQuery(
                    `DELETE FROM teams WHERE team_id = ?`,
                    [teamId]
                );
    
                return jsonResponse({ message: "Team deleted successfully" }, 200);
            } catch (error) {
                console.error("Error deleting team:", error);
                return jsonResponse({ message: "Internal server error" }, 500);
            }
        }
    


        // Handle POST request to kick a member from the team
        if (method === "POST" && url.searchParams.get("action") === "kick-member") {
            const authHeaderTeam = req.headers.get("Authorization");
            const tokenPayloadTeam = validateToken(authHeaderTeam);
          
            if (!tokenPayloadTeam) {
              return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
            }
          
            const { userId: userIdTeam } = tokenPayloadTeam;
            const { userId: userIdToKick } = await req.json();  // Extract the userId to kick from the request body
          
            if (!userIdToKick) {
              return jsonResponse({ message: "User ID to kick is required" }, 400);
            }
          
            try {
              // Fetch the user's team from the database (similar to what you're doing for GET requests)
              const teamCheck = await dbConnect.executeQuery(
                `SELECT team_id, team_role 
                 FROM user_team 
                 WHERE user_id = ?`,
                [userIdTeam]
              );
          
              const [teamCheckRows] = teamCheck as [RowDataPacket[], FieldPacket[]];
              const teamId = teamCheckRows[0].team_id;
          
              // Kick the user
              await dbConnect.executeQuery(
                `DELETE FROM user_team 
                 WHERE user_id = ? AND team_id = ?`,
                [userIdToKick, teamId]
              );
          
              return jsonResponse({ message: "Member kicked successfully" }, 200);
            } catch (error) {
              console.error("Error kicking member:", error);
              return jsonResponse({ message: "Internal server error" }, 500);
            }
          }
        return jsonResponse({ message: "Invalid method or action" }, 400);
    }
    return jsonResponse({ message: "Route not found" }, 404);
}


