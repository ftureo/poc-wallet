import express from "express";
import bodyParser from "body-parser";
import { passClassesRoutes } from "./src/routes/passClasses.routes.js";
import { passObjectsRoutes } from "./src/routes/passObjects.routes.js";
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api", passClassesRoutes);
app.use("/api", passObjectsRoutes);

export default app;
