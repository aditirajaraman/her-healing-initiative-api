import { Router, Request, Response } from "express";
var path = require('path');
import { format, parse } from 'date-fns';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import User from "../models/User";
import { protect } from '../middleware/auth';

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  avatar:string;
}

const userRoutes = Router();

// Get all Users
userRoutes.get("/users", (req: Request, res: Response) => {
  try {
    User.find().then(function(result){
      //console.log('Found Users...');
      res.send(result);
    })
  } catch (error: any) {
    //console.error('Error Finding Users:' + error.message);
    res.send({ success:false, message: `Error Finding Users:${error.message}` });
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
    //console.error('Error Finding Event Orgainizers:' + error.message);
    res.send({ success:false, message: `Error Finding Event Orgainizers:${error.message}` });
  }
});

// A protected route that requires a session
userRoutes.get('/users/profile', (req: Request, res: Response) => {
  //
  // TypeScript checks if req.session.username exists
  console.log('------------------get Profile-----------------');
  const session = req.session as unknown as { username: string };
  console.log(session);
  res.json({ success:false, message: 'This is a protected profile page' });
});

// Get a User by id
userRoutes.get("/users/:id", (req: Request, res: Response) => {
  try {
    User.findById(req.params.id).then(function(result){
      //console.log('Found User...');
      res.send(result);
    })
  } catch (error: any) {
    //console.error('Error Finding User:' + error.message);
    res.send({ success:false, message: `Error Finding User:${error.message}` });
  }
});

// Create a new User
userRoutes.post("/users/register", async (req: Request, res: Response) => {
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
    avatar:'dummyavatar.png',
    username: req.body.username,
    password: req.body.password,
    country: req.body.country.code,
    birthdate: formattedDate
   });


   let foundUser = false;
   /*----------------------Check for Registered Users ----------------*/
   User.exists({username: user.username}).then(async result => { 
      //console.log(result) 
      foundUser = ( result == null )  ? false:true;
      if (foundUser)
        res.json({success: false, message: "Already Registered User."});
      else{
        try {
          //encrypt  
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(req.body.password, salt);
          const savedUser = user.save().then(function(result){
              //console.log('User saved....');
              res.json({success: true, message: "Saved Registered User"});
          })
        } catch (error: any) {
          //console.error('Error saving User:' + error.message);
         res.send({ success:false, message: `Error saving User:${error.message}` });
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
        //res.send("Successfully updated User!");
        res.send({ success:false, message: `Successfully updated User!` });
      }
    }
  );
});

// Get User by ID
userRoutes.delete("/users/:id", (req: Request, res: Response) => {
  try {
    //console.log(req.params.UserName);
    User.deleteOne( {username: req.params.UserName}).then(function(result){
      //console.log('Deleted User...');
      res.send({success:false, message: 'Successfully Deleted User'});
    })
  } catch (error: any) {
    //console.error('Error Deleting User:' + req.params.UserName + ' ' + error.message);
    res.send({ success:false, message: `Error Deleting User:${error.message}` });
  }
});

// Get all Users
userRoutes.post("/users/login", async (req: Request, res: Response) => {
   console.log("---------/users/login---------");
   try {
      const { username, password } = req.body;
      const dbUser = await User.findOne({
        username: req.body.username
      });
      if (!dbUser) {
        res.json({success: false, message: "Username or password incorrect."});
      }
      else{
        console.log("---------Found user---------");
        if (dbUser && (await bcrypt.compare(password, dbUser.password))) {
          console.log("---------Found user : path 1 ---------");
          console.log(dbUser._id);
          let data = dbUser._id as ObjectId;
          const currentUser: CurrentUser = {
            id : data.toHexString(),
            name: dbUser.firstname + ' ' + dbUser.lastname,
            email: dbUser.email,
            avatar: dbUser.avatar
          };
          const token = jwt.sign(
          { 
            id: dbUser._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']
            }
          );
          res.json({success: true, token: token, user:currentUser });
        } 
        else{
           res.json({success: false, message: "Password Comparison failed !"});
        }
      }
   } catch (error: any) {
     res.send({ success:false, message: `User Login failed:${error.message}` });
   }
});

// A logout route to destroy the session
userRoutes.get('/users/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success:false, message: 'Could not log out.' });
    }
    res.status(200).json({ success:true, message: 'Logged out successfully.' });
  });
});

export default userRoutes;