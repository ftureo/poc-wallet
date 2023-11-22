import { Router } from "express";
import { createPassObject, updatePassObject, patchPassObject, signObjectToAssociate } from "../controllers/passObjectsController.js";

export const passObjectsRoutes = Router();

passObjectsRoutes.post("/create-pass-object", createPassObject);
passObjectsRoutes.put("/update-pass-object", updatePassObject);
passObjectsRoutes.patch('/patch-pass-object', patchPassObject)
passObjectsRoutes.get("/get-sign-object", signObjectToAssociate)