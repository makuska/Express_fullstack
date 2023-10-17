import { configDotenv } from "dotenv";
import {checkIfRefreshTokenIsRevoked, revokeToken} from "../repository/tokenRepository.js";
import jsonwebtoken from "jsonwebtoken";


configDotenv()

const {REFRESH_TOKEN_SECRET} = process.env

export async function rotateRefreshToken(req) {
    const result = {
        status: 200,
        error: null
    };

    const refreshToken = req.cookies['refreshToken'];
    const clientIP = req.ip

    if (!refreshToken) {
        result.status = 401;
        result.error = 'Access Denied. No refresh token provided';
        return result;
    }

    try {
        const decodedRefreshToken = await jsonwebtoken.verify(refreshToken, REFRESH_TOKEN_SECRET);

        if (!decodedRefreshToken || !decodedRefreshToken.id || !decodedRefreshToken.role || !decodedRefreshToken.token_id) {
            result.status = 401;
            result.error = 'Access Denied. Invalid refresh token';
        } else {
            const checkTokenFromDatabase = await checkIfRefreshTokenIsRevoked(decodedRefreshToken.token_id);

            if (checkTokenFromDatabase || checkTokenFromDatabase === null) {
                result.status = 401;
                result.error = 'Access Denied. Refresh token has been revoked. Please log in again.';
                console.info(`Unauthorized access attempt from IP: ${clientIP}`);
            } else {
                const revokeResult = await revokeToken(decodedRefreshToken, clientIP);

                if (typeof revokeResult === 'string') {
                    result.status = 500;
                    result.error = revokeResult;
                }
            }
        }
    } catch (err) {
        result.status = 400;
        result.error = 'Unable to verify the refresh token';
        console.error('Error while rotating refresh token:', err);
    }

    return result;
}