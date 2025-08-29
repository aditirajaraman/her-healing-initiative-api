import express, { Request, Response } from "express";
import session from 'express-session';
import cors from 'cors'

import bookRoutes from "./routes/bookRoutes";
import lookupRoutes from "./routes/lookupRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import blogRoutes from "./routes/blogRoutes";
import fileUploadRoutes from "./routes/fileUploadRoutes";
import s3Routes from "./routes/s3Routes";
import utilityRoutes  from "./routes/utilityRoutes";

// include configs
require("dotenv").config();
require("./config/appConfig");

const app = express();
const PORT = process.env.port || 5000;
const SESSION_SECRET = process.env.sessionSecret;

const bodyParser = require('body-parser');

//console.log(`environment : ${config.environment} `);
//console.log(`apiEndpoint : ${config.apiEndpoint} `);
//console.log(`allowedOrigins : ${config.webClient} `);

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
//const allowedOrigins = ['http://localhost:6000'];
const corsOptions = {
  //origin: [process.env.CLIENT_BASE_URL || config.WEB_CLIENT, config.POSTMAN_CLIENT], // Allow requests only from this origin
  origin: process.env.webClient, 
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

// Configure the express-session middleware
/*app.use(session({
  secret: SESSION_SECRET, // A key used to sign the session cookie.
  resave: false, // Prevents session from being re-saved on every request
  saveUninitialized: false, // Prevents creating a session for unauthenticated users
  store : SessionStore,
  cookie: {
    // The absence of `expires` or `maxAge` makes this a session cookie
    // that expires when the user closes their browser.
    httpOnly: true, // Recommended: prevents client-side JS from accessing the cookie
    secure: false, // Use 'secure' in production for HTTPS
    sameSite: 'lax', // Recommended: protects against CSRF attacks
    maxAge: 60 * 1// Session will expire in 5 mins 
  }
}));*/

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
//console.log(process.env.NODE_ENV);
//console.log(process.env.PORT);
//console.log(process.env.webClient); 
//console.log(process.env.awsAccessKeyId); 

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the her-healing-initiative API!");
});

app.listen(PORT, () => {
  console.log(`her-healing-initiative-api is running on port ${PORT}`);
});