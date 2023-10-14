import { Router } from 'express';
import { config as dotenvConfig } from "dotenv";
import db from '../db/conn.js'
import { validatePostData } from "../utils/DataValidation.js";

const postsRouter = Router()
const collectionName = 'posts'
dotenvConfig()

postsRouter.get('/', async (req, res) => {
    const collection = db.collection(collectionName);
    const results = await collection.find({})
        .limit(10)
        .toArray();
    res.send(results).status(200)
});



/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postTitle:
 *                 type: string
 *               postAuthor:
 *                 type: string
 *               postBody:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Post created successfully
 *       '500':
 *         description: Server error occurred
 */
postsRouter.post('/', async (req, res) => {
    const { postTitle, postAuthor, postBody } = req.body;

    if (!validatePostData(req.body)) {
        return res.status(400).json({ message: "Invalid post data!" });
    }
    const newPost = {
        "postTitle": postTitle,
        "postAuthor": postAuthor,
        "postBody": postBody,
    };

    const collection = db.collection(collectionName);

    try {
        await collection.insertOne(newPost, (err) => {
            if (err) {
                console.error("Error: ", err);
                return res.status(500).json({ message: `Unable to save the data: ${JSON.stringify(newPost)} to the collection: ${collectionName}!` });
            }
        });
    } catch (e) {
        console.error("An error has occurred: ", e)
        return res
            .status(500)
            .json({ message: "Error: ", e })
    }
    // return res.status(404).json({ message: "Requested data cannot be found" })
    return res
        .status(201)
        .json({ message: "New post saved successfully" });
})

export default postsRouter