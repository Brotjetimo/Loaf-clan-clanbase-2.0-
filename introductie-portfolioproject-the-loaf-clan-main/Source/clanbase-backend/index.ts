import { authRoutes } from "./routes/auth";
import { teamRoutes } from "./routes/team";
import { userRoutes } from "./routes/user";
import { competitionsRoute } from "./routes/competitions";
import { protectedRoutes } from "./routes/protected";
import jsonResponse, { handleOptionRequest } from "./components/responses";
import { NotificationRoute } from "./routes/notifications";
import { ResultRoutes } from "./routes/results";


async function main() {
    Bun.serve({
        async fetch(req) {
            const url = new URL(req.url);
            const method = req.method;

            if (method === "OPTIONS") {
                return handleOptionRequest();
            }

            try {
                // Route de request naar de juiste handler
                if (url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
                    return authRoutes(req);
                }
                if (url.pathname.startsWith("/create-team") || url.pathname.startsWith("/add-user-to-team") || url.pathname.startsWith("/kick-user") || url.pathname.startsWith("/kick-user") || url.pathname.startsWith("/team-members")) {
                    return teamRoutes(req);
                }
                if (url.pathname.startsWith("/profile") || url.pathname.startsWith("/available-users")) {
                    return userRoutes(req);
                }
                if (url.pathname.startsWith("/protected-endpoint")) {
                    return protectedRoutes(req);
                }
                if (url.pathname.startsWith("/send-invite") || url.pathname.startsWith("/respond-invite") || url.pathname.startsWith("/notifications")) {
                    return NotificationRoute(req);
                }
                if (url.pathname.startsWith("/create-competition") || url.pathname.startsWith("/competitions") || url.pathname.startsWith("/join-competition") || url.pathname.startsWith("/process-competition") || url.pathname.startsWith("/competition-info")  || url.pathname.startsWith("/leave-competition")) {
                    return competitionsRoute(req);
                }
                if (url.pathname.startsWith("/report-result") || url.pathname.startsWith("/resolve-conflict") ) {
                    return ResultRoutes(req);
                }

                return jsonResponse({ message: "Not found" }, 404);
            } catch (error) {
                console.error("Unexpected server error:", error);
                return jsonResponse({ message: "Internal server error" }, 500);
            }
        },
    });
}

main();
