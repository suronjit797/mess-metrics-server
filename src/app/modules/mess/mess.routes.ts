import express from "express";
import * as userController from "./mess.controller";
import { userCreateValidationZod, userLoginValidationZod, userUpdateValidationZod } from "./mess.validation";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";

const userRouter = express.Router();

// auth
userRouter.post("/create", validatorMiddleware(userCreateValidationZod), userController.createUser);
userRouter.post("/login", validatorMiddleware(userLoginValidationZod), userController.loginUser);
userRouter.get("/profile", auth(), userController.getProfile);

// user
userRouter.get("/", auth(userRole.admin), userController.getAll);
userRouter.get("/:id", auth(userRole.admin), userController.getSingle);
userRouter.put("/:id", auth(), validatorMiddleware(userUpdateValidationZod), userController.update);
userRouter.delete("/:id", auth(userRole.admin), userController.remove);

export default userRouter;
