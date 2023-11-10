import express from "express";
import * as userController from "./user.controller";
import { userCreateValidationZod, userLoginValidationZod, userUpdateValidationZod } from "./user.validation";
import { validatorMiddleware } from "../../middleware/validatorMiddleware";
import { auth } from "../../middleware/auth";
import { userRole } from "../../../constants/userConstants";

const userRouter = express.Router();
const { admin, manager } = userRole;

// auth
userRouter.post("/create", validatorMiddleware(userCreateValidationZod), userController.createUser);
userRouter.post("/login", validatorMiddleware(userLoginValidationZod), userController.loginUser);
userRouter.get("/profile", auth(), userController.getProfile);

// user
userRouter.get("/", auth(admin, manager), userController.getAll);
userRouter.get("/:id", auth(admin), userController.getSingle);
userRouter.put("/:id", auth(), validatorMiddleware(userUpdateValidationZod), userController.update);
userRouter.delete("/:id", auth(admin), userController.remove);

export default userRouter;
