/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";
import path from 'path';
import { writeFile, readFile } from 'fs/promises';

/*-----------------------------------imports / Custom -------------------------------*/
import Tag from "../models/Tag";

/*------------------------Custom Interfaces/Properties/ Functions --------------------*/
interface lookupEntity {
  name: string;
  code: string;
}
let lookupEntities: lookupEntity[];

const getFolderPath = (dataType:string) => {
  let dataFolderPath = path.join(__dirname, '..', 'data', dataType + '.json');
  //console.log(dataFolderPath)
  return dataFolderPath;
}

/*----------------------------------------routes--------------------------------------*/

const lookupRoutes = Router();

// Get all countries
lookupRoutes.get("/countries", async (req: Request, res: Response) => {
  try {
    const data = await readFile(getFolderPath('countries'), 'utf8');
    const lookupEntities = JSON.parse(data);
    res.json(lookupEntities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

// Get all states
lookupRoutes.get("/states", async (req: Request, res: Response) => {
  try {
    const data = await readFile(getFolderPath('states'), 'utf8');
    const lookupEntities = JSON.parse(data);
    res.json(lookupEntities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

// Get all cities
lookupRoutes.get("/cities", async (req: Request, res: Response) => {
  try {
    const data = await readFile(getFolderPath('cities'), 'utf8');
    const lookupEntities = JSON.parse(data);
    res.json(lookupEntities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
});

// Get all Users
lookupRoutes.get("/tags", (req: Request, res: Response) => {
  try {
    Tag.find().then(function(result){
      //console.log('Found Users...');
      res.send(result);
    })
  } catch (error: any) {
    console.error('Error Finding Tags:' + error.message);
    res.send(error.message);
  }
});

export default lookupRoutes;