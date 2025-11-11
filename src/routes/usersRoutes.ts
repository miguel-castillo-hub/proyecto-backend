import { Router } from "express"
import UsersController from "../controllers/userController"

const userRouter = Router()

userRouter.post("/register", UsersController.userRegister)
userRouter.post("/login", UsersController.userLogin)

export default userRouter