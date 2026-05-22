import jsonResponse from "../components/responses";

import { validateToken } from "../components/jwt";



export async function protectedRoutes(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    if (url.pathname === "/protected-endpoint") {
        const authHeaderProtected = req.headers.get("Authorization");
        const decodedProtected = validateToken(authHeaderProtected);

        if (!decodedProtected || !decodedProtected.username) {
            return jsonResponse({ message: "Unauthorized" }, 401);
        }

        return jsonResponse(
            { message: "Protected data", user: decodedProtected.username },
            200
        );
    }

    return jsonResponse({ message: "Route not found" }, 404);
} 