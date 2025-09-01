import express, { Request, Response } from "express";
import session from 'express-session';
import cors from 'cors'
import bodyParser from 'body-parser';

import bookRoutes from "./routes/bookRoutes";
import lookupRoutes from "./routes/lookupRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import blogRoutes from "./routes/blogRoutes";
import fileUploadRoutes from "./routes/fileUploadRoutes";
import s3Routes from "./routes/s3Routes";
import utilityRoutes  from "./routes/utilityRoutes";

import 'dotenv/config';
import config  from './config/config';

const app = express();
const PORT = process.env.PORT || config.API_PORT;
const SESSION_SECRET = config.SESSION_SECRET;

//console.log(`environment : ${config.environment} `);
//console.log(`apiEndpoint : ${config.apiEndpoint} `);
//console.log(`allowedOrigins : ${config.webClient} `);
//console.log("-----------------UPLOADS_DIR-------------------");
//console.log(config.MUTLER_UPLOADS_DIR);

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
//const allowedOrigins = ['http://localhost:6000'];
const corsOptions = {
  //origin: [config.CLIENT_BASE_URL || config.WEB_CLIENT, config.POSTMAN_CLIENT], // Allow requests only from this origin
  origin: config.WEB_CLIENT, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies, if your application uses them
  optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
  // headers: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};


app.use(cors(corsOptions));

app.use(express.json());

// This middleware parses application/json bodies
app.use(bodyParser.json());

// Ensure the secret is provided.
// This is a crucial check to prevent the runtime error.


if (!SESSION_SECRET) {
  throw new Error('Secret option required for sessions. Please set the SESSION_SECRET environment variable.');
}

// Configure the express-session middleware.
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}))

// This middleware parses application/x-www-form-urlencoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", bookRoutes);
app.use("/api", lookupRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", blogRoutes);
app.use("/api", fileUploadRoutes);
app.use("/api", s3Routes);
app.use("/api", utilityRoutes);

//console.log("-------process.env / NODE_ENV--------------")
console.log(process.env.NODE_ENV);
console.log(config.API_PORT);
console.log(config.WEB_CLIENT); 
console.log(config.AWS_ACCESS_KEY_ID); 

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the her-healing-initiative API!");
});

app.listen(PORT, () => {
  console.log(`her-healing-initiative-api is running on port ${PORT}`);
});