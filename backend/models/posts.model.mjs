import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    postTitle: {type: String, required: true},
    postAuthor: {type: String, required: true},
    postBody: {type: String, required: true}
})

export const PostsModel = mongoose.model('Posts', postsSchema)