import jsonResponse from "../components/responses";
import DbConnect from "../components/db";
import { validateToken } from "../components/jwt";
import jwt from "jsonwebtoken";
import type { FieldPacket, OkPacket, RowDataPacket } from "mysql2";

const SECRET_KEY = "your_secret_key";
const dbConnect = new DbConnect();

export async function ResultRoutes(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    // Endpoint voor teamleiders om resultaten te rapporteren
    if (url.pathname === "/report-result" && method === "POST") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);

        if (!tokenPayload) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }

        const { competitionId, result, teamId } = await req.json();

        if (!competitionId || !teamId || (result !== 'win' && result !== 'loss')) {
            return jsonResponse({ message: "Invalid input. Ensure competitionId and result ('win' or 'loss') are provided." }, 400);
        }

        console.log({ competitionId, result, teamId });

        try {
            // Check if the user is the team leader of the team reporting the result
            const leaderCheck = await dbConnect.executeQuery(
                `SELECT * FROM teams t 
                     JOIN user_team ut ON t.team_id = ut.team_id 
                     WHERE t.team_id = ? AND ut.user_id = ?`,
                [teamId, tokenPayload.userId]
            );

            const [leaderRows] = leaderCheck as [RowDataPacket[], FieldPacket[]];

            if (!leaderRows.length) {
                return jsonResponse({ message: "You are not authorized to report results for this team." }, 403);
            }

            // Check if a result has already been reported for this competition and team
            const duplicateCheck = await dbConnect.executeQuery(
                `SELECT * FROM competition_confirmations 
                     WHERE competition_id = ? AND team_id = ?`,
                [competitionId, teamId]
            );

            const [duplicateRows] = duplicateCheck as [RowDataPacket[], FieldPacket[]];

            if (duplicateRows.length > 0) {
                return jsonResponse({ message: "A result has already been reported for this team in this competition." }, 409);
            }

            // Store the reported result
            await dbConnect.executeQuery(
                `INSERT INTO competition_confirmations (competition_id, team_id, reported_result, confirmed_by_leader) VALUES (?, ?, ?, TRUE)`,
                [competitionId, teamId, result]
            );

            // Check for conflicts
            const conflictCheck = await dbConnect.executeQuery(
                `SELECT cc.competition_id, cc.team_id, cc.reported_result, cr.winning_team_id, cr.losing_team_id
     FROM competition_confirmations cc
     LEFT JOIN competition_results cr ON cc.competition_id = cr.competition_id
     WHERE (cc.reported_result = 'win' AND cr.winning_team_id IS NOT NULL AND cc.team_id != cr.winning_team_id)
        OR (cc.reported_result = 'loss' AND cr.losing_team_id IS NOT NULL AND cc.team_id != cr.losing_team_id)`
            );

            const [conflictRows] = conflictCheck as [RowDataPacket[], FieldPacket[]];

            if (conflictRows.length > 0) {
                console.log("Admin notification: Conflicting results detected.");
                // Add logic to notify the admin, e.g., send an email or store a notification in the database
            } else {
                console.log("No conflicts detected.");
            }


            return jsonResponse({ message: "Result reported successfully." }, 200);
        } catch (error) {
            console.error(error);
            return jsonResponse({ message: "An error occurred while reporting the result." }, 500);
        }
    }


    // Endpoint voor admins om conflicten op te lossen
    if (url.pathname === "/resolve-conflict" && method === "POST") {
        const authHeader = req.headers.get("Authorization");
        const tokenPayload = validateToken(authHeader);

        if (!tokenPayload || !tokenPayload.isAdmin) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }

        const { competitionId, teamId, correctResult } = await req.json();

        if (!competitionId || !teamId || !['win', 'loss'].includes(correctResult)) {
            return jsonResponse({ message: "Invalid input." }, 400);
        }

        try {
            // Corrigeer de resultaten in de database
            await dbConnect.executeQuery(
                `UPDATE competition_results
                 SET winning_team_id = CASE WHEN ? = 'win' THEN ? ELSE winning_team_id END,
                     losing_team_id = CASE WHEN ? = 'loss' THEN ? ELSE losing_team_id END
                 WHERE competition_id = ?`,
                [correctResult, teamId, correctResult, teamId, competitionId]
            );

            return jsonResponse({ message: "Conflict resolved successfully." }, 200);
        } catch (error) {
            console.error(error);
            return jsonResponse({ message: "An error occurred while resolving the conflict." }, 500);
        }
    }

    return jsonResponse({ message: "Route not found" }, 404);
}
