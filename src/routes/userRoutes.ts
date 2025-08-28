import { Router, Request, Response } from "express";
var path = require('path');
import { format, parse } from 'date-fns';

import User from "../models/User";

const userRoutes = Router();

// Get all Users
userRoutes.get("/users", (req: Request, res: Response) => {
  try {
    User.find().then(function(result){
      //console.log('Found Users...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Users:' + error.message);
    res.send(error.message);
  }
});

// Get event Orgaizers
userRoutes.get("/users/GetUserEventOrganizer", (req: Request, res: Response) => {
  try {
    //User.find({}, { name:'$lastname', value:'$username', _id:0}).then(function(result){
    //User.find().select('username firstname lastname').then(function(result){
    User.aggregate([
      {
        $project: {
          _id: 0, // Exclude the _id field
          name: {
            $concat: [
              "$lastname",
              ", ",
              "$firstname"
            ]
          },
          value : '$username'
        }
      }
    ]).then(function(result){
      //console.log('Found Users...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Event Orgainizers:' + error.message);
    res.send(error.message);
  }
});

// Get a User by id
userRoutes.get("/users/:id", (req: Request, res: Response) => {
  try {
    User.findById(req.params.id).then(function(result){
      //console.log('Found User...');
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
   //console.log("Initiated Post Request...");
   //console.log(req.body);
   //console.log(format(req.body.birthdate, "yyyy-MM-dd"));
   //const formattedDate = parse(req.body.birthdate, 'dd/MM/yyyy', new Date());
   const formattedDate = parse(format(req.body.birthdate, "yyyy-MM-dd"), 'yyyy-MM-dd', new Date());
   //console.log(formattedDate);
   let user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    country: req.body.country.code,
    birthdate: formattedDate
   });

   let foundUser = false;
   /*----------------------Check for Registered Users ----------------*/
   //User.exists( {username: 'aditir'});
   User.exists({username: user.username}).then(result => { 
      //console.log(result) 
      foundUser = ( result == null )  ? false:true;
      if (foundUser)
      {
        res.json({success: false, message: "Already Registered User."});
      }
      else{
        try {
          const savedUser = user.save().then(function(result){
              //console.log('User saved....');
              res.json({success: true, message: "Successful"});
          })
        } catch (error: any) {
          console.error('Error saving User:' + error.message);
          res.json({success: false, message: error.message});
        }
      }
   })

   //console.log('foundUser: '+ foundUser + ' username:' +  user.username);
   
   
});

//Update a book by ID
userRoutes.put("/users/:id", (req: Request, res: Response) => {
  //console.log(req.body);
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
    //console.log(req.params.UserName);
    User.deleteOne( {username: req.params.UserName}).then(function(result){
      //console.log('Deleted User...');
      res.send("Successfully Deleted User");
    })
  } catch (error: any) {
    console.error('Error Deleting User:' + req.params.UserName + ' ' + error.message);
    res.send(error.message);
  }
});

// Get all Users
userRoutes.post("/users/login", async (req: Request, res: Response) => {
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
        //req.session.userId = user.id.toHexString();
        req.session.username = req.body.username;
        res.json({success: true, message: "Authenticated User"});
      }

   } catch (error: any) {
     res.send("InValid");
   }
});

// A logout route to destroy the session
userRoutes.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Could not log out.' });
    }
    res.status(200).json({ message: 'Logged out successfully.' });
  });
});

// A protected route that requires a session
userRoutes.get('/profile', (req: Request, res: Response) => {
  const session = req.session as unknown as { username: string };
  // TypeScript checks if req.session.username exists
  if (session.username) {
    res.status(200).json({
      message: `Welcome, ${req.session.username}!`
      //userId: req.session.userId,
    });
  } else {
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
});

export default userRoutes;