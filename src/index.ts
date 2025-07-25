import express, { Request, Response } from "express";
import cors from 'cors'

import bookRoutes from "./routes/bookRoutes";
import lookupRoutes from "./routes/lookupRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import blogRoutes from "./routes/blogRoutes";

import { Config, Environment  } from "./configuration/config.type";
import { getConfig} from "./configuration/configs/get-config";

const config:Config = getConfig({ENV:"development"})

const app = express();
const PORT = process.env.PORT || 5000;

//console.log(`environment : ${config.environment} `);
//console.log(`apiEndpoint : ${config.apiEndpoint} `);

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
//const allowedOrigins = ['http://localhost:6000'];
const corsOptions = {
  //origin: [process.env.CLIENT_BASE_URL || config.WEB_CLIENT, config.POSTMAN_CLIENT], // Allow requests only from this origin
  origin: config.webClient, 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies, if your application uses them
  optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
  // headers: 'Content-Type, Authorization, Content-Length, X-Requested-With',
};


app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", bookRoutes);
app.use("/api", lookupRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);
app.use("/api", blogRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the her-healing-initiative API!");
});

app.listen(PORT, () => {
  console.log(`her-healing-initiative-api is running on port ${PORT}`);
});