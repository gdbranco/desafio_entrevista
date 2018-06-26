var express = require("express")
var sassMiddleware = require("node-sass-middleware")
var path = require("path")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
// TIMEZONE
var moment = require("moment")
var utcDate = moment.utc().toDate()

// MONGOOSE
var mongoose = require("mongoose")
var url = "mongodb://localhost/desafio_entrevista"
mongoose.connect(url)
mongoose.Promise = global.Promise

// START

var app = express()

app.use(sassMiddleware({
    src: __dirname + "/sass",
    dest: __dirname + "/public/stylesheets",
    prefix: "/stylesheets",
    indentedSyntax: true,
    debug: true
}))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use((req, res, next) => {
    res.locals.moment = require("moment")
    next()
})

app.use(express.static(path.join(__dirname, "/public")))

app.use(methodOverride("_method"))

app.set("view engine", "ejs")

//ROUTING
var postsRoutes = require("./routes/posts")
var errorRoutes = require("./routes/404")
app.use("/posts", postsRoutes)
app.use(errorRoutes)

var middleware = require("./middleware")
var Post = require("./models/post")
var cheerio = require("cheerio")
var request = require("request")
var seed = require("./seeds")

// LISTEN
app.listen(8000,"0.0.0.0", ()=>{
    Post.findOne().sort({id: -1}).exec((error, found) => {
        if(!error){
                let id = found ? found.id : 0
                middleware.posts_counter = id
                seed()
                console.log("Servidor up")
        }
    })
})