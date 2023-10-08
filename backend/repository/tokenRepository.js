import db from '../db/conn.mjs'
import jsonwebtoken from "jsonwebtoken";

const collectionName = 'BlacklistedTokens'

export async function checkIfRefreshTokenIsRevoked(decodedRefreshTokenId) {
    try {
        const token = await db.collection(collectionName).findOne({
            token_id: decodedRefreshTokenId
        }, (err) => {
            if (err) {
                throw new Error(`Error occurred when searching for the token from the database, error message: ${err}`)
            }
        })
        if (!token.isValid) return token
        else return null
    } catch (e) {
        throw new Error(`Error: ${e}`)
    }
}

export async function revokeToken(decodedRefreshToken, clientIP) {
    try {
        await db.collection(collectionName).updateOne(
            { token_id: decodedRefreshToken.token_id },
            {
                $set: {
                    isValid: false,
                    revokedTokenClientIP: clientIP // Add the new field and set it to clientIP
                }
            },
            { upsert: false } // Use upsert option to insert or update
        , (err) => {
            if (err) {
                throw new Error(`Error occurred when updating the refreshToken in the database, error message: ${err}`)
            }
        });
    } catch (e) {
        throw new Error(`Error: ${e}`)
    }
}

export async function saveRefreshTokenToCollection(refreshToken, clientIP) {
    const decodedRefreshToken = jsonwebtoken.decode(refreshToken)

    try {
        await db.collection(collectionName).insertOne({
            token_id: decodedRefreshToken.token_id,
            issuedTokenClientIP: clientIP,
            tokenExpDateSeconds: decodedRefreshToken.exp,
            isValid: true
        }, (err) => {
            if (err) {
                throw new Error(`Error occurred when saving the refreshToken to the database, error message: ${err}`)
            }
        })
    } catch (e) {
        throw new Error(`Error: ${e}`)
    }
}