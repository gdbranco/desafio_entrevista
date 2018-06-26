var mongoose = require("mongoose")
var Post = require("../models/post")
var request = require("request")
var cheerio = require("cheerio")
var middleware = require("../middleware")

function create_post(post){
    Post.findOne({title: post.title}, (error, found) => {
        if(!error){
            if(found==null){
                middleware.posts_counter += 1
                post['id'] = middleware.posts_counter
                console.log("não tem esse")
                Post.create(post, (error, added) => {
                    if(!error){
                        console.log("New post added" + added)
                    }
                })
            }else{
                console.log("Ja tem")
                console.log(found)
            }
        }
    })
}

function load_news(){
    request("http://www.ifpe.edu.br/noticias", (error, response, body) => {
        if(!error){
            if(response && response.statusCode == 200){
                let $ = cheerio.load(body)
                $('div.tileContent').each(function (i, item){
                    let $1 = cheerio.load(($(item).html()))
                    post = {}
                    post['title'] = $1('h2.tileHeadline').text().trim()
                    post['body'] = $1('p').text().trim()
                    create_post(post)
                })
            }
        }
    })
}

function load_json(){
    if(middleware.posts_counter == 0){
        request("https://jsonplaceholder.typicode.com/posts", (error, response, body) => {
            if(!error){
                if(response && response.statusCode == 200){
                    let json = JSON.parse(body)
                    json.forEach((post) => {
                        let _post = {"title": post['title'], "body": post['body']}
                        create_post(_post)
                    })
                }
            }
        })
    }
}

function seedInit(){
    load_json()
    load_news()
}

module.exports = seedInit