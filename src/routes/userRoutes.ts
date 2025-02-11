import { Router, Request, Response } from "express";
var path = require('path');
import { format, parse } from 'date-fns';

import User from "../models/User";

const userRoutes = Router();

// Get all Users
userRoutes.get("/users", (req: Request, res: Response) => {
  try {
    User.find().then(function(result){
      console.log('Found Users...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Users:' + error.message);
    res.send(error.message);
  }
});

// Get a User by id
userRoutes.get("/users/:id", (req: Request, res: Response) => {
  try {
    User.findById(req.params.id).then(function(result){
      console.log('Found User...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding User:' + error.message);
    res.send(error.message);
  }
});

// Create a new User
userRoutes.post("/users", (req: Request, res: Response) => {
   //var user = new User(req.body);
   //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
   const formattedDate = parse(req.body.birthdate, 'dd/MM/yyyy', new Date());
   
   let user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    country: req.body.country,
    birthdate: formattedDate
   });

   try {
     const savedUser = user.save().then(function(result){
         console.log('User saved....');
         res.send(savedUser);
     })
 
 
   } catch (error: any) {
     console.error('Error saving User:' + error.message);
     res.send('Error saving User:' + error.message);
   }
});

//Update a book by ID
userRoutes.put("/users/:id", (req: Request, res: Response) => {
  console.log(req.body);
  let user = User.findByIdAndUpdate(
    req.params.id,
    req.body,
    (err: any, user: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Successfully updated User!");
      }
    }
  );
});

// Delete a book by ID
userRoutes.delete("/users/:id", (req: Request, res: Response) => {
  try {
    console.log(req.params.UserName);
    User.deleteOne( {username: req.params.UserName}).then(function(result){
      console.log('Deleted User...');
      res.send("Successfully Deleted User");
    })
  } catch (error: any) {
    console.error('Error Deleting User:' + req.params.UserName + ' ' + error.message);
    res.send(error.message);
  }
});

// Get all Users
userRoutes.post("/users/validateUser", async (req: Request, res: Response) => {
   try {
      const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
      });
      if (!user) {
        res.json({success: false, message: "Username or password incorrect."});
        return;
      }
      else{
        res.json({success: true, message: "Found User"});
      }

   } catch (error: any) {
     res.send("InValid");
   }
});

export default userRoutes;