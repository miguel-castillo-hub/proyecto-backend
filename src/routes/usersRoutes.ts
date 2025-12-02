import { Router } from "express"
import UsersController from "../controllers/userController"

const userRouter = Router()

userRouter.post("/register", UsersController.register)
userRouter.post("/login", UsersController.login)

export default userRouter