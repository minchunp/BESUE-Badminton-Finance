import type { Request, Response } from "express";
import shuttle from "../models/shuttle.js";

export const createShuttle = async (req: Request, res: Response) => {
   try {
      const { name, pricePerTube } = req.body;
      const newShuttle = new shuttle({ name, pricePerTube });
      await newShuttle.save();

      res.status(201).json({ message: "Successful type of shuttle!", data: newShuttle });
   } catch (error) {
      res.status(500).json({ message: "Error while creating shuttle: ", error });
   }
};

export const getShuttles = async (req: Request, res: Response) => {
   try {
      const shuttles = await shuttle.find();

      res.status(200).json(shuttles);
   } catch (error) {
      res.status(500).json({ message: "Error retrieving the shuttle list: ", error });
   }
};
