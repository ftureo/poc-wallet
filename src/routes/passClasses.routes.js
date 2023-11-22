import { Router } from "express";
import {
    createPassClass,
    getListOfClasses,
    updatePassClass,
} from "../controllers/passClassController.js";

export const passClassesRoutes = Router();

passClassesRoutes.post("/create-pass-class", createPassClass);
passClassesRoutes.get("/get-list-classes", getListOfClasses);
passClassesRoutes.post("/update-pass-class", updatePassClass);
