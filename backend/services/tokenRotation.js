import { configDotenv } from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import {checkIfTokenIsRevoked, revokeToken} from "../repository/tokenRepository.js";
import {refreshTokenOptions} from "../utils/tokenUtils.js";
import {cookieOptions} from "../utils/cookieOptions.js";
import {randomUUID} from "crypto";

configDotenv()

const {REFRESH_TOKEN_SECRET} = process.env

export async function rotateRefreshToken(req, res){
    if (!req.cookies['refreshToken']) return res.status(401).send({ message: "Access Denied. No refresh token provided." })

    const refreshToken = req.cookies['refreshToken']
    const clientIP = req.ip

    try {
        const decodedRefreshToken = await jsonwebtoken.verify(refreshToken, REFRESH_TOKEN_SECRET)

        if (!decodedRefreshToken || !decodedRefreshToken.id || !decodedRefreshToken.role || !decodedRefreshToken.token_id) {
            return res.status(401).send({ message: 'Access Denied. Invalid refresh token.' });
        }

        const checkTokenFromDatabase = await checkIfTokenIsRevoked(decodedRefreshToken.token_id)
        if (checkTokenFromDatabase) {
            // TODO since this was illegitimate use of refreshToken, all refreshTokens should be revoked (even the legitimate one)
            // see pole tglt true, peaks ka comparema IP addresse jne...
            console.info(`Unauthorized access attempt from IP: ${clientIP}`)
            return res.status(401).send({ message: 'Access Denied. Refresh token has been revoked. Please log in again!' })
        }

        await revokeToken(decodedRefreshToken, clientIP)

        const newRefreshToken = jsonwebtoken.sign(
            {id: decodedRefreshToken.id, role: decodedRefreshToken.role, token_id: randomUUID()},
            REFRESH_TOKEN_SECRET,
            refreshTokenOptions
        )

        res.cookie('refreshToken', newRefreshToken, cookieOptions);
    } catch (err) {
        console.error('Error while rotating refresh token:', err);
        return res.status(400).send({ message: 'Unable to verify the refresh token', error: err });
    }
}