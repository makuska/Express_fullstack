import jsonwebtoken from 'jsonwebtoken'
import { configDotenv } from "dotenv";
import {createAccessToken, createRefreshToken} from "../utils/tokenUtils.js";
import {rotateRefreshToken} from "../services/tokenRotation.js";
import {cookieOptions} from "../utils/cookieOptions.js";

configDotenv()

export function verifyToken(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                if (err instanceof jsonwebtoken.TokenExpiredError) {
                    const refreshToken = req.cookies['refreshToken'];

                    if (!refreshToken) return res.status(401).send({ message: "Access Denied. No refresh token provided" });

                    try {
                        const decodedRefreshToken = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

                        const currentTimeStamp = Math.floor(Date.now() / 1000)
                        if (decodedRefreshToken.exp <= currentTimeStamp) {
                            return res.status(401).send({ message: 'Access Denied. Refresh token has expired.' }) //login required
                        }

                        req.user = { id: decodedRefreshToken.id, role: decodedRefreshToken.role };

                        const rotationResult = await rotateRefreshToken(req)
                        if (rotationResult.status === 200) {
                            const newRefreshToken = createRefreshToken(decodedRefreshToken.id, decodedRefreshToken.role)
                            const newAccessToken = createAccessToken(decodedRefreshToken.id, decodedRefreshToken.role)
                            req.header.authorization = `Bearer ${newAccessToken}`
                            res.cookie('refreshToken', newRefreshToken, cookieOptions)
                        } else {
                            return res.status(rotationResult.status).send({ message: rotationResult.error})
                        }


                        next()
                    } catch (e) {
                        return res.status(400).send({ message: "Unable to verify the refreshToken", error: e })
                    }
                }
                // // invalid token (tampered)
                // return res.status(400).send({ message: "Invalid token, please provide a valid refresh token!"})
            }
            if (decoded) {
                // const user = await db.collection('User').findOne({ _id: new ObjectId(decoded.id) });
                // if (!user) req.user = undefined
                req.user = { id: decoded.id, role: decoded.role };
                next()
            }
        });
    } else {
        req.user = undefined;
        next()
    }
}

// export function handleTokenRotation() {}

export function checkRole(requiredRole) {
    return (req, res, next) => {
        if (req.user.role === requiredRole || req.user.role === 'admin') {
            next()
        } else {
            return res.status(401).send({ message: "Unauthorized!" })
        }
    }
}