import mongoose from "mongoose"

const Schema = mongoose.Schema;

const pageSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String
});

export const PageModel = mongoose.model("Pages", pageSchema);