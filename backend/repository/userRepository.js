import db from "../db/conn.js";
import {ObjectId} from "mongodb";

const collectionName = 'User'

export async function getUserById(userId) {
    try {
        const user = await db.collection(collectionName).findOne({
            _id: new ObjectId(userId)
        }, (err) => {
            if (err) {
                return null
            }
        })
        if (user) {
            return user
        }
    } catch (e) {
        throw new Error(`Internal server error while fetching the user by id: ${e}`)
    }
}