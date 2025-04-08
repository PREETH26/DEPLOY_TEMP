import express from 'express';

import AuthMiddle from "../Middlewares/AuthMiddleware.js"
import {checkRole} from "../Middlewares/AuthMiddleware.js"
import { createSubject, deleteSubject, getAllSubjects, getSubjectsById, updateSubject } from '../Controllers/SubjectController.js';


const subjectRouter = express.Router();    

subjectRouter.post("/:classId",AuthMiddle,createSubject);
subjectRouter.get("/:classId",AuthMiddle,getAllSubjects);
subjectRouter.get("/:classId/:subjectId",AuthMiddle,getSubjectsById);
subjectRouter.put("/:classId/:subjectId",AuthMiddle,checkRole(["Admin","HOD"]),updateSubject);
subjectRouter.delete("/:classId/:subjectId",AuthMiddle,checkRole(["Admin","HOD"]),deleteSubject);





export default subjectRouter;