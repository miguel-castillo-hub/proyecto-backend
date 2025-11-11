import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { IUser } from "../interfaces/IUsers"
import { model, Model, Schema } from "mongoose"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  versionKey: false
})

const User: Model<IUser> = model("User", userSchema)

const SECRET_KEY = process.env.JWT_SECRET!

class userController {
  static userRegister = async (request: Request, response: Response): Promise<void | Response> => {
    try {
      const { email, password } = request.body

      if (!email || !password) {
        return response.status(400).json({ error: "Datos invalidos" })
      }

      // crear el hash de la password
      const hash = await bcrypt.hash(password, 10)
      const newUser = new User({
        email, password: hash
      })

      await newUser.save()
      response.json(newUser)
    } catch (e) {
      const error = e as Error
      if (error.name === "MongoServerError") {
        return response.status(409).json({ message: "Usuario ya existente en nuestra base de datos" })
      }
    }
  }

  static userLogin = async (request: Request, response: Response): Promise<void | Response> => {
    try {
      const { email, password } = request.body

      if (!email || !password) {
        return response.status(400).json({ error: "Datos invalidos" })
      }

      const user = await User.findOne({ email })
      if (!user) {
        return response.status(401).json({ error: "No autorizado" })
      }

      // validar la password
      const isValid = await bcrypt.compare(password, user.password)

      if (!isValid) {
        return response.status(401).json({ error: "No autorizado" })
      }

      // permiso especial -> sesión de uso
      // jsonwebtoken -> jwt

      // 1 - payload -> información pública que quiero compartir del usuario logueado
      // 2 - clave secreta -> firma que valida el token
      // 3 - opciones -> cuando expira

      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" })
      response.json({ token })
    } catch (e) {
      const error = e as Error
      response.status(500).json({ error: error.message })
    }
  }
}

export default userController