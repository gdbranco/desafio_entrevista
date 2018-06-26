var mongoose = require("mongoose")

var postSchema = new mongoose.Schema({
    id: Number,
    title: String,
    body: String
})

module.exports = mongoose.model("Post", postSchema);