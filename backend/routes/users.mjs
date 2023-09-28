import { Router } from "express";
import { configDotenv } from "dotenv";
import db from '../db/conn.mjs'
import {ObjectId} from "mongodb";

configDotenv()
const usersRouter = Router()
const collectionName = 'User'

usersRouter.get('/', async (req, res) => {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.find({})
            .limit(25)
            .toArray();
        if (result) return res.send(result).status(200)
    } catch (e) {
        console.error("An error has occurred: ", e)
        return res
            .status(500)
            .json({ message: "Error fetching requested data", e })
    }
    return res.status(404).json({ message: "Requested data cannot be found" })
})

usersRouter.get('/user:id', async (req, res) => {
    try {
        const collection = db.collection(collectionName);
        const query = {_id: new ObjectId(req.params.id)};
        const result = await collection.findOne(query);
        if (result) return res.send(result).status(200)
    } catch (e) {
        console.error("An error has occurred: ", e)
        return res
            .status(500)
            .json({ message: "Error fetching requested data", e })
    }
    return res.status(404).json({ message: "Requested data cannot be found" })
});

usersRouter.get("/latest", async (req, res) => {
    try {
        const collection = db.collection(collectionName)
        const result = await collection.find()
            .sort({ _id: -1 }).limit(3).toArray();
        if (result) return res.send(result).status(200)
    } catch (e) {
        console.error("An error has occurred: ", e)
        return res
            .status(500)
            .json({ message: "Error fetching requested data", e })
    }
    return res.status(404).json({ message: "Requested data cannot be found" })
});

usersRouter.get('/name:name', async (req, res) => {
    try {
        const filter = { name: req.params.name }
        const collection = db.collection(collectionName)
        const result = await collection.find(filter)
        if (result) return res.send(result).status(200)
    } catch (e) {
        console.error("An error has occurred: ", e)
        return res
            .status(500)
            .json({ message: "Error fetching requested data", e })
    }
    return res.status(404).json({ message: "Requested data cannot be found" })
})

export default usersRouter;