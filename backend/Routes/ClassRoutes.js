import express from 'express';

import AuthMiddle from "../Middlewares/AuthMiddleware.js"
import {checkRole} from "../Middlewares/AuthMiddleware.js"
import {createClass, deleteClass, getAllClass, getClassById, updateClass } from '../Controllers/ClassController.js';

const classRouter = express.Router();    

// classRouter.post("/create", (req, res, next) => {
//     next();
// }, AuthMiddle, createClass);
classRouter.post("/create",AuthMiddle,createClass);
// classRouter.post("/createChat",createChat);
classRouter.get("/",AuthMiddle,getAllClass);
// classRouter.get("/groups",AuthMiddle,getGroupChats);
classRouter.get("/:id",AuthMiddle,getClassById);
classRouter.put("/:id",AuthMiddle,checkRole(["Admin","HOD"]),updateClass);
classRouter.delete("/:id",AuthMiddle,checkRole(["Admin"]),deleteClass);


export default classRouter;