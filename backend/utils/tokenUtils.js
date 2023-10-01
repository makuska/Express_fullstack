import {randomUUID} from "crypto";
import jsonwebtoken from "jsonwebtoken";

const {REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET} = process.env

export const accessTokenOptions = {
    algorithm: 'HS256',
    allowInsecureKeySizes: true,
    expiresIn: "2m",
}
export const refreshTokenOptions = {
    algorithm: 'HS256',
    allowInsecureKeySizes: true,
    expiresIn: "14d",
}

export function createRefreshToken(userId, userRole) {
    const refreshTokenPayload = { id: userId, role: userRole, token_id: randomUUID() }
    try {
        return jsonwebtoken.sign(refreshTokenPayload, REFRESH_TOKEN_SECRET, refreshTokenOptions)
    } catch (e) {
        return `Error while signing a new refresh token, error msg: ${e}`
    }
}

export function createAccessToken(userId, userRole) {
    const refreshTokenPayload = { id: userId, role: userRole, token_id: randomUUID() }
    try {
        return jsonwebtoken.sign(refreshTokenPayload, ACCESS_TOKEN_SECRET, accessTokenOptions)
    } catch (e) {
        return `Error while signing a new access token, error msg: ${e}`
    }
}