import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {validateUserSignupData} from '../utils/DataValidation.js'
import db from '../db/conn.mjs'
import {createAccessToken, createRefreshToken} from "../utils/tokenUtils.js";
import {cookieOptions} from "../utils/cookieOptions.js";
import {saveRefreshTokenToCollection} from "../repository/tokenRepository.js";


export function getNewAccessToken(req, res) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        return res.status(401).send({ message: 'Access Denied. No refresh token provided.' });
    }

    try {
        const decodedRefreshToken = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const currentTimestamp = Math.floor(Date.now() / 1000); // current time in seconds
        if (decodedRefreshToken.exp && currentTimestamp >= decodedRefreshToken.exp) {
            return res.status(401).send({ message: 'Access Denied. Refresh token has expired.' });
        }

        const accessToken = createAccessToken(decodedRefreshToken.id, decodedRefreshToken.role)

        res
            .header('Authorization', accessToken)
            .send(decodedRefreshToken);
    } catch (error) {
        return res.status(400).send({ message: 'Invalid refresh token.' });
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
        validateUserSignupData(user);

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
            return res.status(404).send({ message: `User with username: ${req.body.username} not found!` });
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
        await saveRefreshTokenToCollection(refreshToken, clientIP)

        res
            .cookie('refreshToken', refreshToken, cookieOptions)
            .header('Authorization', accessToken)
            .status(200).send({
            username: user.username,
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send({ message: err });
    }
}

export async function logout(req, res) {
    const refreshTokenCookie = req.cookie['refreshToken']

    // Check if the refreshToken is in the database
    try {
        const foundRT = await db.collection('RefreshTokens').findOne()

        if (!foundRT) {
            res.clearCookie('refreshToken')
            return res.status(204)
        }
    } catch (e) {
        return res
            .status(500)
            .send({ message: "error", e})
    }

    res.clearCookie('refreshToken')

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