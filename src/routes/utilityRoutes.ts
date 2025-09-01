/*-----------------------------------imports----------------------------------------*/
import { Router, Request, Response } from "express";

/*-----------------------------------imports / Custom -------------------------------*/
import { UniqueIdGenerator } from '../utils/UniqueIDGenerator';

/*----------------------------------------routes--------------------------------------*/
const utilityRoutes = Router();

// Get all countries
utilityRoutes.get("/Utils/GetUniqueId", (req: Request, res: Response) => {
  const uniqueIdGenerator = new UniqueIdGenerator(); 
  res.send(uniqueIdGenerator.getUniqueId());
});

export default utilityRoutes;