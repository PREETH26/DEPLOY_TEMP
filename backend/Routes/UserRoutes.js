import express from 'express'
import { deleteUser, getInstitution, getMembers, getUser, updateInstitution, updateUser } from '../Controllers/UserController.js'
import AuthMiddle from '../Middlewares/AuthMiddleware.js'

const userRouter = express.Router();
userRouter.get('/profile',AuthMiddle,getUser);
userRouter.put('/update-institution',AuthMiddle,updateInstitution);
userRouter.get('/institute',getInstitution);
userRouter.get('/members',AuthMiddle,getMembers);
userRouter.put('/update-name',AuthMiddle,updateUser);
userRouter.delete('/delete',AuthMiddle, deleteUser);
export default userRouter;