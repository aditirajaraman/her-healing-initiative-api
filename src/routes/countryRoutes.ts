import { Router, Request, Response } from "express";
var path = require('path');

const countryRoutes = Router();

interface Country {
  id: number;
  name: string;
  code: string;
}

let countries: Country[];

const { writeFile, readFile } = require('fs');
const dataFolderPath = path.join(__dirname, '..', 'data', 'countries.json');

// Get all books
countryRoutes.get("/countries", (req: Request, res: Response) => {
  readFile(dataFolderPath, (error:any, data:any) => {
    if (error) {
      console.log(error);
      return;
    }
    countries = JSON.parse(data);
    res.json(countries);
  });
});

export default countryRoutes;