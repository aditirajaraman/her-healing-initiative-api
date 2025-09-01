/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";

/*-----------------------------------imports / Custom -------------------------------*/
import Event from "../models/Event";

/*-----------------------------------------routes------------------------------------*/
const eventRoutes = Router();

// Get all Users
eventRoutes.get("/events", (req: Request, res: Response) => {
  try {
    Event.find().then(function(result){
      //console.log('Found Events...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Events:' + error.message);
    res.send(error.message);
  }
});

eventRoutes.get("/events/:id", (req: Request, res: Response) => {
  try {
    Event.findById(req.params.id).then(function(result){
      //console.log('Found Event...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Event:' + error.message);
    res.send(error.message);
  }
});


// Create a new Event
eventRoutes.post("/events/createEvent", (req: Request, res: Response) => {
    //var user = new User(req.body);
    //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
    //console.log("Initiated Post Request...");
    //console.log(req.body);
    //const formattedDate = parse(format(req.body.birthdate, "yyyy-MM-dd"), 'yyyy-MM-dd', new Date());
    //console.log(formattedDate);
    let event = new Event({
      eventTitle: req.body.eventTitle,
      eventSubTitle: req.body.eventSubTitle,
      eventSummary: req.body.eventSummary,
      eventImage: req.body.eventImage,
      eventTag:req.body.eventTag,
      eventOrganizer: req.body.eventOrganizer
    });

    /*----------------------Save Events ----------------*/
    try {
      const savedEvent = event.save().then(function(result){
          //console.log('User saved....');
          res.json({success: true, message: "Successful"});
      })
    } catch (error: any) {
      console.error('Error saving Event:' + error.message);
      res.json({success: false, message: error.message});
    }
});

export default eventRoutes;