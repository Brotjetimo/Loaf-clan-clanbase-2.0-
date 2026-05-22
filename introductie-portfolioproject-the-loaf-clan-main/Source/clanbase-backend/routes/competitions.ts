import jsonResponse from "../components/responses";
import DbConnect from "../components/db";
import { validateToken } from "../components/jwt";
import type { FieldPacket, RowDataPacket } from "mysql2";

const dbConnect = new DbConnect();

export async function competitionsRoute(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (url.pathname === "/create-competition" && method === "POST") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);

        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized: Invalid token" }, 401);
        }

        const { userId } = tokenPayload;

        try {
            // Check if the user is an admin based on their user ID
            const roleResult = await dbConnect.executeQuery(
                `SELECT user_role FROM users WHERE id = ?`,
                [userId]
            );
            const [roleRows] = roleResult as [RowDataPacket[], FieldPacket[]];

            if (!roleRows.length || roleRows[0].user_role !== "admin") {
                return jsonResponse({ message: "Forbidden: Only admins can create competitions" }, 403);
            }

            // Parse the competition details from the request body
            const { competition_name, start_date, end_date, game, max_teams, game_type, description, competition_type } = await req.json();

            // Ensure all required fields are present
            if (!competition_name || !start_date || !end_date || !game || !max_teams || !game_type || !description || !competition_type) {
                return jsonResponse({ message: "Invalid data" }, 400);
            }

            // Validate start_date and end_date formats
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return jsonResponse({ message: "Invalid date format. Please use 'YYYY-MM-DD HH:MM:SS'." }, 400);
            }

            // Insert the competition into the database
            await dbConnect.executeQuery(
                `INSERT INTO competitions (name, start_date, end_date, game, max_teams, game_type, description, competition_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    competition_name,
                    startDate.toISOString().slice(0, 19).replace("T", " "),
                    endDate.toISOString().slice(0, 19).replace("T", " "),
                    game,
                    max_teams,
                    game_type,
                    description,
                    competition_type
                ]
            );


            return jsonResponse({ message: "Competition created successfully" }, 200);
        } catch (error) {
            console.error("Error creating competition:", error);
            return jsonResponse({ message: "Internal server error" }, 500);
        }
    }



    if (url.pathname === "/join-competition" && method === "POST") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }
    
        const { userId } = tokenPayload;
        const { competitionId } = await req.json();
    
        if (!competitionId) {
            console.error("No competition ID provided.");
            return jsonResponse({ message: "Competition ID is required." }, 400);
        }
    
        try {
            // Verify that the competition exists
            const competitionCheck = await dbConnect.executeQuery(
                `SELECT competition_id, max_teams FROM competitions WHERE competition_id = ?`,
                [competitionId]
            );
    
            const [competitionRows] = competitionCheck as [RowDataPacket[], FieldPacket[]];
            if (!competitionRows.length) {
                return jsonResponse({ message: "Invalid competition ID." }, 404);
            }
    
            const maxTeams = competitionRows[0].max_teams;
    
            // Fetch the user's team ID and team role
            const teamResult = await dbConnect.executeQuery(
                `SELECT team_id, team_role FROM user_team WHERE user_id = ?`,
                [userId]
            );
    
            const [teamRows] = teamResult as [RowDataPacket[], FieldPacket[]];
            if (!teamRows.length) {
                return jsonResponse({ message: "User is not part of any team." }, 400);
            }
    
            const teamId = teamRows[0].team_id;
            const teamRole = teamRows[0].team_role;
    
            // Check if the user is the team leader
            if (teamRole !== "team_leader") {
                return jsonResponse({ message: "Only the team leader can join the competition." }, 400);
            }
    
            // Check if the team has already joined the competition
            const existingJoin = await dbConnect.executeQuery(
                `SELECT * FROM competition_teams WHERE competition_id = ? AND team_id = ?`,
                [competitionId, teamId]
            );
    
            const [existingRows] = existingJoin as [RowDataPacket[], FieldPacket[]];
            if (existingRows.length) {
                return jsonResponse({ message: "Team has already joined this competition." }, 400);
            }
    
            // Check the number of teams already in the competition
            const teamCountCheck = await dbConnect.executeQuery(
                `SELECT COUNT(*) as team_count FROM competition_teams WHERE competition_id = ?`,
                [competitionId]
            );
    
            const [teamCountRows] = teamCountCheck as [RowDataPacket[], FieldPacket[]];
            const teamCount = teamCountRows[0].team_count;
    
            if (teamCount >= maxTeams) {
                return jsonResponse({ message: "Competition is full." }, 400);
            }
    
            // Insert into competition_teams
            await dbConnect.executeQuery(
                `INSERT INTO competition_teams (competition_id, team_id) VALUES (?, ?)`,
    
                [competitionId, teamId]
            );
    
            return jsonResponse({ message: "Successfully joined competition!" }, 200);
        } catch (error) {
            console.error("Error joining competition:", error);
            return jsonResponse({ message: "Internal server error." }, 500);
        }
    }
    
    if (url.pathname === "/process-competition" && method === "POST") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }
    
        const { competitionId } = await req.json();
    
        if (!competitionId) {
            return jsonResponse({ message: "Competition ID is required." }, 400);
        }
    
        try {
            // Haal competitiegegevens op
            const competitionCheck = await dbConnect.executeQuery(
                `SELECT competition_id, end_date FROM competitions WHERE competition_id = ?`,
                [competitionId]
            );
    
            const [competitionRows] = competitionCheck as [RowDataPacket[], FieldPacket[]];
    
            if (!competitionRows.length) {
                return jsonResponse({ message: "Invalid competition ID." }, 404);
            }
    
            const endDate = competitionRows[0].end_date;
    
            // Controleer of de competitie is afgelopen
            if (new Date(endDate) < new Date()) {
                // Haal alle teams op die aan de competitie meedoen
                const teamsResult = await dbConnect.executeQuery(
                    `SELECT team_id FROM competition_teams WHERE competition_id = ?`,
                    [competitionId]
                );
    
                const [teams] = teamsResult as [RowDataPacket[], FieldPacket[]];
                if (teams.length < 2) {
                    return jsonResponse({ message: "Not enough teams to process the competition." }, 400);
                }
    
                // **Punten genereren voor elk team**
                const teamPoints: { team_id: number; points: number }[] = teams.map((team) => ({
                    team_id: team.team_id,
                    points: Math.floor(Math.random() * 100), // Willekeurige punten (0-99)
                }));
    
                // **Zorg ervoor dat er een duidelijke winnaar is**
                const winnerIndex = Math.floor(Math.random() * teamPoints.length);
                teamPoints[winnerIndex].points = Math.max(...teamPoints.map((tp) => tp.points)) + 1;
    
                // **Sorteer teams op punten voor een ranglijst**
                const sortedTeams = teamPoints.sort((a, b) => b.points - a.points);
    
                // **Sla de resultaten op in de database met team_id**
                for (const team of sortedTeams) {
                    await dbConnect.executeQuery(
                        `INSERT INTO competition_results (competition_id, team_id, points, result_date)
                        VALUES (?, ?, ?, NOW())`,
                        [competitionId, team.team_id, team.points]
                    );
                }
    
                // **Update win/loss records voor teams**
                await dbConnect.executeQuery(
                    `UPDATE teams SET wins = wins + 1 WHERE team_id = ?`,
                    [sortedTeams[0].team_id] // Winnaar = team met hoogste punten
                );
    
                await dbConnect.executeQuery(
                    `UPDATE teams SET losses = losses + 1 WHERE team_id = ?`,
                    [sortedTeams[sortedTeams.length - 1].team_id] // Verliezer = team met laagste punten
                );
    
                // Maak een MySQL event aan om de competitie en de bijbehorende gegevens na 48 uur te verwijderen
                await dbConnect.query(
                    `
                    CREATE EVENT delete_competition_${competitionId}
                    ON SCHEDULE AT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 48 HOUR)
                    DO
                    BEGIN
                        DELETE FROM competitions WHERE competition_id = ${competitionId};
                        DELETE FROM competition_teams WHERE competition_id = ${competitionId};
                        DELETE FROM competition_results WHERE competition_id = ${competitionId};
                    END;
                    `
                );
    
                return jsonResponse(
                    {
                        message: "Competition processed and scheduled for deletion after 48 hours.",
                        result: {
                            competitionId,
                            ranking: sortedTeams, // Ranglijst teruggeven
                        },
                    },
                    200
                );
            } else {
                return jsonResponse({ message: "Competition is not over yet." }, 400);
            }
        } catch (error) {
            console.error(error);
            return jsonResponse({ message: "An error occurred while processing the competition." }, 500);
        }
    }
    
    

  // Route to fetch competition details and teams
if (url.pathname === "/competition-info" && method === "POST") {
    const authHeader = req.headers.get("Authorization");
    const tokenPayload = validateToken(authHeader);

    if (!tokenPayload) {
        return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const { competitionId } = await req.json();

    if (!competitionId) {
        return jsonResponse({ message: "Competition ID is required." }, 400);
    }

    try {
        // Fetch competition details
        const competitionResult = await dbConnect.executeQuery(
            `SELECT 
                c.competition_id, 
                c.name, 
                c.game, 
                c.description, 
                c.start_date, 
                c.end_date, 
                c.max_teams,
                c.game_type,
                COUNT(ct.team_id) AS joined_teams
            FROM competitions c
            LEFT JOIN competition_teams ct ON c.competition_id = ct.competition_id
            WHERE c.competition_id = ? 
            GROUP BY c.competition_id`,
            [competitionId]
        );

        const [competitionRows] = competitionResult as [RowDataPacket[], FieldPacket[]];

        if (!competitionRows.length) {
            return jsonResponse({ message: "Competition not found." }, 404);
        }

        const competition = competitionRows[0];

        // Fetch teams in the competition, including their points
        const teamsResult = await dbConnect.executeQuery(
            `SELECT 
                t.team_id, 
                t.team_name, 
                IFNULL(SUM(cr.points), 0) AS points,   -- Calculate total points
                COUNT(ct.team_id) AS joined_teams,
                c.max_teams
            FROM teams t
            JOIN competition_teams ct ON t.team_id = ct.team_id
            JOIN competitions c ON c.competition_id = ct.competition_id
            LEFT JOIN competition_results cr ON cr.team_id = t.team_id AND cr.competition_id = c.competition_id
            WHERE c.competition_id = ?
            GROUP BY t.team_id, t.team_name, c.max_teams`,
            [competitionId]
        );

        console.log("Teams result:", teamsResult);

        const [teams] = teamsResult as [RowDataPacket[], FieldPacket[]];

        return jsonResponse(
            { competition, teams },
            200
        );
    } catch (error) {
        console.error("Error fetching competition info:", error);
        return jsonResponse({ message: "Internal server error" }, 500);
    }
}


    if (url.pathname === "/leave-competition" && method === "POST") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }
    
        const { userId } = tokenPayload;
        const { competitionId } = await req.json();
    
        if (!competitionId) {
            return jsonResponse({ message: "Competition ID is required." }, 400);
        }
    
        try {
            // Fetch the user's team ID
            const teamResult = await dbConnect.executeQuery(
                `SELECT team_id FROM user_team WHERE user_id = ?`,
                [userId]
            );
    
            const [teamRows] = teamResult as [RowDataPacket[], FieldPacket[]];
            if (!teamRows.length) {
                return jsonResponse({ message: "User is not part of any team." }, 400);
            }
    
            const teamId = teamRows[0].team_id;
    
            // Check if the team is part of the competition
            const existingJoin = await dbConnect.executeQuery(
                `SELECT * FROM competition_teams WHERE competition_id = ? AND team_id = ?`,
                [competitionId, teamId]
            );
    
            const [existingRows] = existingJoin as [RowDataPacket[], FieldPacket[]];
            if (!existingRows.length) {
                return jsonResponse({ message: "Team is not part of this competition." }, 400);
            }
    
            // Remove the team from the competition
            await dbConnect.executeQuery(
                `DELETE FROM competition_teams WHERE competition_id = ? AND team_id = ?`,
                [competitionId, teamId]
            );
    
            return jsonResponse({ message: "Successfully left the competition!" }, 200);
        } catch (error) {
            console.error("Error leaving competition:", error);
            return jsonResponse({ message: "Internal server error." }, 500);
        }
    }

    



    if (url.pathname === "/competitions" && method === "GET") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);
    
        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }
    
        const { userId } = tokenPayload;
    
        try {
            // Check if the user is an admin or a team leader
            const roleCheckResult = await dbConnect.executeQuery(
                `SELECT ut.team_role, u.user_role FROM user_team ut
                LEFT JOIN users u ON ut.user_id = u.id
                WHERE ut.user_id = ?`,
                [userId]
            );
    
            const [roleRows] = roleCheckResult as [RowDataPacket[], FieldPacket[]];
    
            if (!roleRows.length) {
                return jsonResponse({ message: "User not found or unauthorized." }, 401);
            }
    
            const userRole = roleRows[0].team_role;
            const userAdminRole = roleRows[0].user_role; // User role from the users table
    
            // Check if the user is an admin or a team leader
            if (!(userAdminRole === "admin" || userRole === "team_leader")) {
                return jsonResponse({ message: "Unauthorized: User is neither an admin nor a team leader." }, 401);
            }
    
            // Query to fetch competitions, now considering the user’s roles
            const competitionsResult = await dbConnect.executeQuery(
                `SELECT
                    c.competition_id,
                    c.name,
                    c.game,
                    c.game_type,
                    c.start_date,
                    c.end_date,
                    COUNT(ct.team_id) AS joined_teams,
                    c.max_teams,
                    EXISTS (
                        SELECT 1 FROM competition_teams ct2 
                        JOIN user_team ut ON ct2.team_id = ut.team_id
                        WHERE ct2.competition_id = c.competition_id 
                        AND ut.user_id = ?
                        LIMIT 1
                    ) AS is_joined
                FROM competitions c
                LEFT JOIN competition_teams ct ON c.competition_id = ct.competition_id
                GROUP BY c.competition_id, c.name, c.game, c.game_type, c.start_date, c.end_date, c.max_teams;`,
                [userId]
            );
    
            if (!competitionsResult || !competitionsResult[0]) {
                return jsonResponse({ competitions: [] }, 200);
            }
    
            const [rows] = competitionsResult as [RowDataPacket[], FieldPacket[]];
    
            return jsonResponse({ competitions: rows }, 200);
        } catch (error) {
            console.error("Error fetching competitions:", error);
            return jsonResponse({ message: "Internal server error" }, 500);
        }
    }
    
    
    
    


    return jsonResponse({ message: "Route not found" }, 404);
}
