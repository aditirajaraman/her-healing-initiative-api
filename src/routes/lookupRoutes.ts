import { Router, Request, Response } from "express";
var path = require('path');

import Tag from "../models/Tag";

const lookupRoutes = Router();

interface lookupEntity {
  name: string;
  code: string;
}
let lookupEntities: lookupEntity[];

const { writeFile, readFile } = require('fs');
const getFolderPath = (dataType:string) => {
  let dataFolderPath = path.join(__dirname, '..', 'data', dataType + '.json');
  //console.log(dataFolderPath)
  return dataFolderPath;
}

// Get all countries
lookupRoutes.get("/countries", (req: Request, res: Response) => {
  readFile(getFolderPath('countries'), (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    lookupEntities = JSON.parse(data);
    res.json(lookupEntities);
  });
});

// Get all states
lookupRoutes.get("/states", (req: Request, res: Response) => {
  readFile(getFolderPath('states'), (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    lookupEntities = JSON.parse(data);
    res.json(lookupEntities);
  });
});

// Get all cities
lookupRoutes.get("/cities", (req: Request, res: Response) => {
  readFile(getFolderPath('cities'), (error:any, data:any) => {
    if (error) {
      //console.log(error);
      return;
    }
    lookupEntities = JSON.parse(data);
    res.json(lookupEntities);
  });
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