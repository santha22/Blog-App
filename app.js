//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "An online platform where individuals or organizations can share their thoughts, ideas, experiences, or expertise on a particular subject. It serves as a platform for writers, known as bloggers, to express themselves and connect with their audience.";
const aboutContent = "In a blog, each post typically consists of a title and content. The title provides a concise summary of the blog post's main topic, while the content delves deeper into the subject matter, providing valuable information, personal anecdotes, opinions, or insights.";
const contactContent = "contact linkedin profile link to : https://www.linkedin.com/in/santha-kumar-8593a8235";

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect(process.env.DB_URL,
                 {useNewUrlParser: true});


const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "New Post",
  content: "To add a New Post, Send 'compose' as parameter. You will be redirected to Compose Page."
});

const defaultItems = [post1];

// Home Route - GET
app.get("/", function(req, res){ 
  Post.find({}).then(function(foundList){
    if(foundList.length == 0){
      Post.create(defaultItems).then(function(){
        console.log("Successfully Inserted");
      }).catch(function(err){
        console.log(err);
      });
      res.redirect("/");
    } else{
      res.render("home", {
        startingContent:homeStartingContent,
        posts: foundList
    });
    }
  }).catch(function(err){
    console.log("Error! Please try again");
  });

});

// About Route - GET
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});


// Contact Route - GET
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


// Compose Route - GET
app.get("/compose", function(req, res){
  res.render("compose");
});


// Compose Route - POST
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  post.save();
  res.redirect("/");
});


// POSTS Route - GET
app.get("/posts/:postId", function(req, res){
  const requestedPostId =req.params.postId;

  Post.findById(requestedPostId).then(function(post){
      res.render("post",{
        title : post.title,
        content : post.content,
        postId: post._id
      });
  });

});

app.post("/delete", function(req, res){
  const postId = req.body.buttonId;

  Post.findByIdAndRemove(postId)
  .then(function(){
    res.redirect("/");
  })
  .catch(function(err){
    console.log("Error! Please try again");
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
