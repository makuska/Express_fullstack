import db from '../db/conn.js'

export async function checkDuplicateUsernameOrEmail(req, res, next) {
    try {
        const username = req.body.username;
        const email = req.body.email;

        const userWithUsername = await db.collection('User').findOne({ username: username });
        if (userWithUsername) {
            return res.status(400).send({ message: "Username already in use, please choose another!" });
        }

        const userWithEmail = await db.collection('User').findOne({ email: email });
        if (userWithEmail) {
            return res.status(400).send({ message: "Email already in use, please choose another!" });
        }

        next();
    } catch (err) {
        console.error("Error in checkDuplicateUsernameOrEmail:", err);
        res.status(500).send({ message: "Internal server error" });
    }
}
