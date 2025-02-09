import express, { Request, Response } from "express";
//import cors from 'cors'
import bookRoutes from "./routes/bookRoutes";
import countryRoutes from "./routes/countryRoutes";
const app = express();
const PORT = process.env.PORT || 5500;

// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:6000'];

//const options: cors.CorsOptions = {
//  origin: allowedOrigins
//};

//app.use(cors(options));

app.use(express.json());

app.use("/api", bookRoutes);
app.use("/api", countryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the her-healing-initiative API!");
});

app.listen(PORT, () => {
  console.log(`her-healing-initiative-api is running on port ${PORT}`);
});