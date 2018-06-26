var express = require("express")
var Post = require("../models/post")
var router = express.Router()
var middlware = require('../middleware')

router.get("/", (req, res) => {
    Post.find({}).sort({id: -1}).exec((error, allPosts) => {
        if(!error){
            if(req.accepts('html')){
                res.render("posts/index",{
                    posts: allPosts
                })
            }else{
                res.send(allPosts)
            }
        }
    })
    
})

router.post("/", (req, res) => {
    middlware.posts_counter += 1
    req.body.post['id'] = middlware.posts_counter
    Post.create(req.body.post, function(error, post){
        if(!error){
            console.log("Novo post add")
            console.log(post)
            if(req.accepts('html')){
                res.redirect("/posts")
            }
        }
    })
})

router.get("/:id", (req, res) => {
    Post.findById(req.params.id).exec((error, found)=>{
        if(!error){
            if(found){
                if(req.accepts('html')){
                res.render("posts/show", {
                    post: found
                })
                }else{
                    res.send(found)
                }
            }
        }
    })
})

router.get("/:id/edit", (req, res) => {
    Post.findById(req.params.id).exec((error, found)=>{
        if(!error){
            if(found){
                res.render("posts/edit", {
                    post: found
                })
            }
        }
    })
})

router.put("/:id", (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body.post).exec((error, updated)=>{
        if(!error){
            if(req.accepts('html')){
                res.redirect("/posts/" + req.params.id)
            }
        }
    })
})

module.exports = router