import { Router, Request, Response } from "express";
var path = require('path');
import Blog from "../models/Blog";
const blogRoutes = Router();

interface Blog {
  id: number;
  title: string;
  author: string;
  authorIcon: string;
  url: string;
  blogImage:string;
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
    let time: number = Date.parse(req.body.publicationDate);
    let pubDate: Date = new Date(time);
    let blog = new Blog({
      title: req.body.title,
      author:'blog',
      authorIcon:'elwinsharvill',
      blogImage:'arts',
      publicationDate:pubDate,
      tag: req.body.tag,
      content:'test',
      likes:0,
      comments:0,
      createdAt :Date.now()	
    });

    console.log(blog);

    /*----------------------Save Events ----------------*/
    try {
      const savedEvent = blog.save().then(function(result){
          //console.log('User saved....');
          res.json({success: true, message: "Blog saved Successfully"});
      })
    } catch (error: any) {
      console.error('Error saving Blog:' + error.message);
      res.json({success: false, message: error.message});
    }
});

export default blogRoutes;