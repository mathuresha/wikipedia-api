const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main(){
    await mongoose.connect("mongodb://localhost:27017/wikiDB");
}

//creating schema
const articleSchema = {
    title: String,
    content: String
}

//creating model
const Article = mongoose.model("Article", articleSchema);


app.route("/articles")
.get(function(req, res){

    Article.find(function(err, foundArticles){
        res.send(foundArticles);
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err)
            res.send("Successfully added a new article.");
        else
            res.send(err);
    });
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err)
            res.send("Deleted successfully")
        else{
            res.send(err);
        }
    })
});


app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(!err){
            res.send(foundArticle);     
        }else{
            res.send(err);
        }
    })
})
.put(function(req, res){

    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })
  
  .patch(function(req, res){
  
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })
.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(err)
            res.send(err)
        else
            res.send("Successfully deleted!")
    });
});


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})