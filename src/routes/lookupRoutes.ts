/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";
import path from 'path';
import { writeFile, readFile } from 'fs/promises';

/*-----------------------------------imports / Custom -------------------------------*/
import Tag from "../models/Tag";
import EventTag from "../models/EventTag";

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
lookupRoutes.get("/tags", async (req: Request, res: Response) => {
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

// Get all Users
lookupRoutes.get("/eventTags", async (req: Request, res: Response) => {
   try {
    const result = await EventTag.find();
    // Group by groupName
    // Group tags by groupName and groupCode
    const groupMap: Record<string, { label: string, code: string, items: any[] }> = {};
    result.forEach(tag => {
      const key = `${tag.groupName}|${tag.groupCode}`;
      if (!groupMap[key]) {
        groupMap[key] = {
          label: tag.groupName,
          code: tag.groupCode,
          items: []
        };
      }
      groupMap[key].items.push({
        label: tag.name,
        value: tag.value
      });
    });

    const grouped = Object.values(groupMap);
    res.json(grouped);
    //res.send(result);
  } catch (error: any) {
    console.error('Error Finding EventTags:' + error.message);
    res.send(error.message);
  }
});

export default lookupRoutes;