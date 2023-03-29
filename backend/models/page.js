const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pageSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String
});

const PageModel = mongoose.model("Pages", pageSchema);

module.exports = PageModel;