import { Router, Request, Response } from "express";
import { Types } from 'mongoose';
var path = require('path');
import Blog from "../models/Blog";
const blogRoutes = Router();
const { URLSearchParams } = require('url');

interface Blog {
  id: Types.ObjectId
  blogId: string;
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
    console.log('--------/blogs/:Id"---------');
    Blog.findById(req.params.id).then(function(result){
      //console.log('Found Event...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Blog by ObjectId:' + error.message);
    res.send(error.message);
  }
});

blogRoutes.get("/blogs/getBlogByBlogId/:blogId", (req: Request, res: Response) => {
  try {
    console.log('--------/blogs/getBlogByBlogId/---------');
    Blog.findOne({ blogId: req.params.blogId }).then(function(result){
      //console.log('Found Event...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Blog by BlogId:' + error.message);
    res.send(error.message);
  }
});

blogRoutes.post("/blogs/createBlog", (req: Request, res: Response) => {
    //var user = new User(req.body);
    //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
    //console.log("Initiated Post Request...");
    //console.log(req.body);
    //const formattedDate = parse(format(req.body.birthdate, "yyyy-MM-dd"), 'yyyy-MM-dd', new Date());
    //console.log(formattedDate);
    const queryString = req.url.split('?')[1];
    const params = new URLSearchParams(queryString);
    const blogId = params.get('blogId');
    console.log("----------posted Data------------")
    let time: number = Date.parse(req.body.publicationDate);
    let pubDate: Date = new Date(time);
    let blog = new Blog({
      blogId: blogId,
      blogImage:req.body.blogImage,
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      author:req.body.author,
      authorIcon:req.body.authorIcon,
      publicationDate:pubDate,
      tag: req.body.tag,
      createdAt:new Date()
    });

    console.log(blog);

    /*----------------------Save Events ----------------*/
    try {
      const savedEvent = blog.save().then(function(result){
          //console.log('User saved....');
          res.json({status:true, message: "Blog saved Successfully"});
      })
    } catch (error: any) {
      console.error('Error Creating Blog:' + error.message);
      res.json({status:false, message: error.message});
    }
});

blogRoutes.post("/blogs/saveBlog", async (req: Request, res: Response) => {
    //var user = new User(req.body);
    //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
    console.log("SaveBlog() Post Requested...");
    /*----------------------Save Blog ----------------*/
    const queryString = req.url.split('?')[1];
    const params = new URLSearchParams(queryString);
    const _id = params.get('_id');
    try {
      //1, This provides a layer of type-safety and ensures the ID format is correct.
      const objectId = Types.ObjectId.createFromHexString(_id);

      let time: number = Date.parse(req.body.publicationDate);
      let pubDate: Date = new Date(time);

      // 2. Define the update object
      const update = { 
        title: req.body.title, 
        shortDescription: req.body.shortDescription,
        tag: req.body.tag,
        blogImage: req.body.blogImage,
        publicationDate: pubDate,
        updatedAt:new Date()
      };

      // 3. Call findByIdAndUpdate with correct generics and options
      const updatedUser = await Blog.findByIdAndUpdate(
        objectId,
        update,
        {
          new: true, // Returns the updated document. Crucial for getting the modified data.
          runValidators: true // Runs schema validators on the update operation.
        }
      );

      // 4. Handle the result
      // The type of `updatedUser` is correctly inferred as `IUser | null`.
      if (updatedUser) {
        res.json({status:true, message: `Blog with ObjectId:${req.body._id} updated!`});
      } else {
        res.json({status:false, message: `Blog with ObjectId:${req.body._id} not found !`});
      }
      
    } catch (error: any) {
      res.json({status:false, message: error.message});
    }
});

export default blogRoutes;