/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";
import { Types } from 'mongoose';

/*-----------------------------------imports / Custom -------------------------------*/
import Event from "../models/Event";
import User from "../models/User";

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

eventRoutes.get("/events/:id", async (req: Request, res: Response) => {
  try {
    //console.log('Finding Event...' + req.params.id);
    Event.findOne({ eventId: req.params.id }).then(async function(result){
      console.log('Found Event...');
      //res.send(result);
      if (!result) {
        res.status(404).json({ success: false, message: "Event not found" });
      }
      else{
        const organizers = result.eventOrganizers;
        
        // Find all users and collect their firstnames
        const users = await Promise.all(
          organizers.map(org => User.findOne({ username: org }))
        );
        const fullnames = users
          .filter(user => user) // filter out nulls if any user is not found
          .map(user => user.firstname + ' ' + user.lastname); // use username if firstname is empty
        res.json({
          id: result._id,
          eventId: result.eventId,
          eventTitle: result.eventTitle,
          eventSubTitle: result.eventSubTitle,
          eventSummary: result.eventSummary,
          eventImage: result.eventImage,
          eventTags: result.eventTags,
          eventOrganizerType: result.eventOrganizerType,
          eventOrganizers: result.eventOrganizers,
          eventOrganizersFullNames: fullnames,
          eventLocationType: result.eventLocationType,
          eventLocation: result.eventLocation,
          eventDate: result.eventDate,
          eventStartTime: result.eventStartTime,
          eventEndTime: result.eventEndTime,
          faqs: result.faqs,
          itenaries: result.itenaries,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt
        });
      }
    })
  } catch (error: any) {
    console.error('Error Finding Event:' + error.message);
    res.send(error.message);
  }
});


// Create a new Event
eventRoutes.post("/events/createEvent", async (req: Request, res: Response) => {
    //var user = new User(req.body);
    //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
    //console.log("Initiated Post Request...");
    //console.log(req.body);
    //const formattedDate = parse(format(req.body.birthdate, "yyyy-MM-dd"), 'yyyy-MM-dd', new Date());
    //console.log(formattedDate);

    let eventTags: string[] = [];
    if (Array.isArray(req.body.eventTags)) {
      eventTags = req.body.eventTags.map(String);
    } else if (typeof req.body.eventTags === 'string') {
      eventTags = [req.body.eventTags];
    }

    let eventOrganizers: string[] = [];
    if (Array.isArray(req.body.eventOrganizers)) {
      eventOrganizers = req.body.eventOrganizers.map(String);
    } else if (typeof req.body.eventOrganizers === 'string') {
      eventOrganizers = [req.body.eventOrganizer];
    }

    // Convert faqs to match FAQ interface
    let faqs: { question: string; answer: string }[] = [];
    if (Array.isArray(req.body.faqs)) {
      faqs = req.body.faqs
        .filter((faq: any) => faq && typeof faq.question === 'string' && typeof faq.answer === 'string')
        .map((faq: any) => ({
          question: faq.question,
          answer: faq.answer
        }));
    }

    // Convert itenaries to match itenary interface
    let itenaries: { 
        Subject: string; 
        Location: string, 
        Description: string, 
        IsAllDay : boolean, 
        StartTime: string, 
        EndTime: string
      } [] = [];
    if (Array.isArray(req.body.itenaries)) {
      itenaries = req.body.itenaries
        .filter((itenary: any) => itenary)
        .map((itenary: any) => ({
          title: itenary.Subject,
          location: itenary.Location,
          description: itenary.Description,
          allday: itenary.IsAllDay,
          startTime: itenary.StartTime,
          endTime: itenary.EndTime,
        }));
    }

    let event = new Event({
      eventTitle: req.body.eventTitle,
      eventSubTitle: req.body.eventSubTitle,
      eventSummary: req.body.eventSummary,
      eventImage: req.body.eventImage,
      eventTags:eventTags,
      eventOrganizerType: req.body.eventOrganizerType,
      eventOrganizers: eventOrganizers,
      eventLocationType: req.body.eventLocationType,
      eventLocation: req.body.eventLocation,
      eventDate : req.body.eventDate,
      eventStartTime : req.body.eventStartTime,
      eventEndTime : req.body.eventEndTime,
      faqs: faqs,
      itenaries: itenaries,
      createdAt:new Date()
    });

    /*----------------------Save Events ----------------*/
    try {
      console.log("----------------Saving Event-------------");
      console.log(event);
      const savedEvent = event.save().then(function(result){
        res.json({success: true, message: "Successful"});
      })
    } catch (error: any) {
      console.error('Error saving Event:' + error.message);
      res.json({success: false, message: error.message});
    }
});

eventRoutes.post("/blogs/saveEvent", async (req: Request, res: Response) => {
    //var user = new User(req.body);
    //const formattedDate: Date = format(req.body.birthdate, 'dd/MM/yyyy');
    console.log("saveEvent() Post Requested...");
    /*----------------------Save Blog ----------------*/
    const queryString = req.url.split('?')[1];
    const params = new URLSearchParams(queryString);
    const id = params.get('id');
    const eventId = params.get('eventId');
    console.log("-----parameters------");
    console.log(id);
    console.log(eventId);
    try {
      //1, This provides a layer of type-safety and ensures the ID format is correct.
      const objectId = Types.ObjectId.createFromHexString(id);

      // 2. Define the update object
      const update = { 
        eventTitle: req.body.eventTitle, 
        eventSubTitle: req.body.eventSubTitle,
        eventSummary: req.body.eventSummary,
        eventImage: req.body.eventImage,
        eventTags: req.body.eventTags,
        updatedAt: new Date()
      };

      // 3. Call findByIdAndUpdate with correct generics and options
      const updatedUser = await Event.findByIdAndUpdate(
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
        res.json({status:true, message: `Event with ObjectId:${req.body._id} updated!`});
      } else {
        res.json({status:false, message: `Event with ObjectId:${req.body._id} not found !`});
      }
      
    } catch (error: any) {
      res.json({status:false, message: error.message});
    }
})

export default eventRoutes;