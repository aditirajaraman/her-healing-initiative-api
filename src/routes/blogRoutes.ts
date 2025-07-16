import { Router, Request, Response } from "express";
var path = require('path');

const blogRoutes = Router();

interface Blog {
  id: number;
  title: string;
  author: string;
  authoricon: string;
  url: string;
  imglink:string;
  description:string;
  tag:string;
  likes: number;
  comments: number;
  createdAt:string;
  updatedAt:string;
}

let blogs: Blog[];

const { writeFile, readFile } = require('fs');
const dataFolderPath = path.join(__dirname, '..', 'data', 'blogs.json');

// Get all books
blogRoutes.get("/blogs", (req: Request, res: Response) => {
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      console.log(error);
      return;
    }
    blogs = JSON.parse(data);
    //console.log(parsedData);
    res.json(blogs);
  });
});


export default blogRoutes;