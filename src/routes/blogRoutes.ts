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

export default blogRoutes;