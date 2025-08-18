import { Router, Request, Response } from "express";
var path = require('path');
import Blog from "../models/Blog";
const blogRoutes = Router();
const { URLSearchParams } = require('url');

interface Blog {
  id: number;
  title: string;
  author: string;
  authorIcon: string;
  url: string;
  content:string;
  tag:string;
  likes: number;
  comments: number;
  publicationDate:Date;
  createdAt:Date;
  updatedAt:Date;
}

// Get all blogs
blogRoutes.get("/blogs", (req: Request, res: Response) => {
 try {
    Blog.find().then(function(result){
      //console.log('Found Events...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Blogs:' + error.message);
    res.send(error.message);
  }
});

//get blog
blogRoutes.get("/blogs/:id", (req: Request, res: Response) => {
  try {
    Blog.findById(req.params.id).then(function(result){
      //console.log('Found Event...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Blog:' + error.message);
    res.send(error.message);
  }
});

blogRoutes.post("/blogs", (req: Request, res: Response) => {
    //var user = new User(req.body);
    //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
    //console.log("Initiated Post Request...");
    //console.log(req.body);
    //const formattedDate = parse(format(req.body.birthdate, "yyyy-MM-dd"), 'yyyy-MM-dd', new Date());
    //console.log(formattedDate);
    const queryString = req.url.split('?')[1];
    
    console.log("----------queryString------------")
    //console.log(queryString);
    // Create a URLSearchParams object from the querystring
    const params = new URLSearchParams(queryString);
    // Use the .get() method to access a single value
    const blogId = params.get('blogId');
    
    //const blogId = "e4ac845b-101a-4808-8d4e-20c2718d4daf";
    let time: number = Date.parse(req.body.publicationDate);
    let pubDate: Date = new Date(time);
    let blog = new Blog({
      blogId: blogId,
      title: req.body.title,
      author:req.body.author,
      authorIcon:req.body.authorIcon,
      publicationDate:pubDate,
      tag: req.body.tag,
      likes:0,
      comments:0,
      createdAt :Date.now()	
    });

    console.log(blog);

    /*----------------------Save Events ----------------*/
    try {
      const savedEvent = blog.save().then(function(result){
          //console.log('User saved....');
          res.json({status:true, message: "Blog saved Successfully"});
      })
    } catch (error: any) {
      console.error('Error saving Blog:' + error.message);
      res.json({status:false, message: error.message});
    }
});

export default blogRoutes;