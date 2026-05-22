import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key";

export const validateToken = (authHeader: string | null): jwt.JwtPayload | null => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    try {
        return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    } catch (error) {
        console.error("JWT validation error:", error);
        return null;
    }
};

export default jwt;
