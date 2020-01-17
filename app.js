const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// creating new app instance
const app = express();
// for template using ejs
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article",articleSchema);

// Requests tragetting ll get requests
app.route("/articles")
.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
        res.send(err);
    }

  });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content:  req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added");
    }else{
      res.send(err);
    }
  });

})
.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("deleted all articles");
    }else{
      res.send(err);
    }
  });
});


// Requests targetting specific request
app.route("/articles/:articleTitle")
// req.params.articleTitle = "mansi"
.get(function(req,res){
  // req.params.articleTitle
Article.findOne({title: req.params.articleTitle }, function(err,foundArticle){
  if(!err){
    res.send(foundArticle);
  }else{
    res.send("No articles match that titles")
  }
});
})
.put(function(req,res){
  Article.update(
  {title:  req.params.articleTitle},
  {title: req.body.title, content: req.body.content},
  {overwrite: true},
  function(err){
    if(!err){
      res.send("successfully added");
    }
  }
);
})
.patch(function(req,res){
Article.update(
  {title: req.params.articleTitle},
  {$set: req.body},
  function(err){
    if(!err){
      res.send("successfully added");
    }else{
      res.send(" error ");
    }
  }

);

})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle },
    function(err){
      if(!err){
          res.send("successfully deleted");
      }else{
          res.send(" error ");
      }
    }
  );
});

app.listen(3000,function(){
  console.log("successfully logged");
});
