// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES
import express, { Request, Response } from "express"
import cors from "cors"
import { connectDB } from "./config/mongodb"
import productRouter from "./routes/productRoutes"
import userRouter from "./routes/usersRoutes"
import morgan from "morgan"
import limiter from "./middleware/rateLimitMiddleware"
import IUserTokenPayload from "./interfaces/IUserTokenPayload"
import dotenv from "dotenv"
import logger from "./config/logger"
import path from "node:path"
import emailService from "./services/emailService"
import fs from "fs"
dotenv.config()

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload
    }
  }
}

const PORT = process.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

const uploadsPath = path.join(__dirname, "../uploads")

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

app.use(morgan("dev"))

app.get("/", (request: Request, response: Response) => {
  response.json({ status: true })
})

app.use("/v3/auth", limiter, userRouter)
// http://localhost:3861/v3/productos?
app.use("/v3/productos", productRouter)

// enviar email
app.post("/email/send", emailService)

// endpoint para el status del servidor
app.use((request, response) => {
  response.status(404).json({ error: "El recurso no se encuentra" })
})

// servidor en escucha
app.listen(PORT, () => {
  console.log(`YOUR TAKING TOO http://localhost:${PORT}`)
  connectDB()
})