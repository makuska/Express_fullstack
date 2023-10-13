import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import db from '../db/conn.mjs'
import {createAccessToken, createRefreshToken} from "../utils/tokenUtils.js";
import {cookieOptions} from "../utils/cookieOptions.js";
import {
    checkIfRefreshTokenIsRevoked,
    revokeToken,
    saveRefreshTokenToCollection
} from "../repository/tokenRepository.js";

// The browser's console logs this as an error because most modern browsers log 400-599 statuses as an error.
export async function verifyRefreshToken(req, res) {
    const refreshToken = req.cookies['refreshToken']
    console.log("(18:5) - refreshToken inside the verifyRefreshToken function: ",refreshToken)
    if (!refreshToken) return res.status(401).send({ message: "Please login again, no verification token provided"})

    try {
        const decodedRefreshToken = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedRefreshToken) return res.status(401).send({ message: 'Access Denied. Token is invalid.' });

        const currentTimestamp = Math.floor(Date.now() / 1000); // current time in seconds
        if (decodedRefreshToken.exp && currentTimestamp >= decodedRefreshToken.exp) {
            return res.status(401).send({ message: 'Access Denied. Token has expired.' });
        }

        const result = await checkIfRefreshTokenIsRevoked(decodedRefreshToken.token_id)
        if (result) {
            return res.status(401).send({ message: 'Access Denied. Token is invalid.' });
        } else if (typeof result === 'string') {
            return res.status(500).send({ message: result })
        }

        const resUser = {
            userId: decodedRefreshToken.id,
            role: decodedRefreshToken.role
        }
        return res.status(200).send({resUser, message: "RefreshToken verified!"})
    } catch (e) {
        return res.status(500).send({ message: `There was an error in the verification of the refreshToken, error: ${e}` });
    }
}


export async function signup(req, res) {
    const user = {
        username: req.body.username,
        email: req.body.email,
        role: 'user',
        password: bcrypt.hashSync(req.body.password, 12),
    }

    try {
        const result = await db.collection('User').insertOne(user);

        // insertOne returns an acknowledgement and the _id value of the newly inserted document - so we can use the id field as an additional check
        if (result && result.insertedId) {
            res.status(201).send({ message: "User registered successfully" });
        } else {
            console.error("Error inserting user");
            res.status(500).send({ message: "Error inserting user" });
        }
    } catch (e) {
        console.error("User details validation failed:", e);
        res.status(500).send({ message: "User details validation failed" });
    }
}


export async function login(req, res) {
    // console.log(JSON.stringify(req.body))
    try {
        const user = await db.collection('User').findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).send({ message: `User not found` });
        }

        // Compare passwords
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(404).send({ accessToken: null, message: "Invalid password" });
        }

        const accessToken = createAccessToken(user._id, user.role)
        const refreshToken = createRefreshToken(user._id, user.role)

        // save refreshToken to the database
        const clientIP = req.ip
        const result = await saveRefreshTokenToCollection(refreshToken, clientIP)
        if (typeof result === 'string') {
            res.status(500).send({ message: result })
        }

        const resUser = {
            username: user.username,
            email: user.email,
            userId: user._id,
            role: user.role
        }

        res
            .cookie('refreshToken', refreshToken, cookieOptions)
            .header('Authorization', accessToken)
            .status(200).send({
            resUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send({ message: err });
    }
}

export async function logout(req, res) {
    const refreshTokenFromCookie = req.cookies['refreshToken']
    if (!refreshTokenFromCookie) return res.status(204).send()

    const decodedRefreshToken = jsonwebtoken.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET)
    if (!decodedRefreshToken) {
        console.error("Unable to verify the refreshToken for the logout request!")
        res.clearCookie('refreshToken', { expires: new Date(0) });
        return res.status(204).send()
    }

    // Check if the refreshToken is in the database
    try {
        const result = await revokeToken(decodedRefreshToken, req.ip)
        if (typeof result === 'string') {
            console.error(result);
            return res.status(500).send({ message: result }); //send error as response to the client
        }

        res.clearCookie('refreshToken', { expires: new Date(0) });
        return res.status(204).send()
    } catch (e) {
        return res
            .clearCookie('refreshToken', { expires: new Date(0) })
            .status(500)
            .send({ message: "error", e})
    }
}

export function sampleUserEvent(req, res) {
    let specialEvents = [
        {
            "_id": "3",
            "name": "Auto Expo",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ]
    res.send(JSON.stringify(specialEvents))
}

export function sampleAdminEvent(req, res) {
    let specialEvents = [
        {
            "_id": "1",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "2",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "3",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "4",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "5",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        },
        {
            "_id": "6",
            "name": "Auto Expo Special",
            "description": "lorem ipsum",
            "date": "2012-04-23T18:25:43.511Z"
        }
    ]
    res.json(specialEvents)
}