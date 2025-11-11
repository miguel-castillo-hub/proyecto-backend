// LEVANTAR NUESTRO SERVICIO Y CONFIGURACIONES GLOBALES
import express, { Request, Response } from "express"
import cors from "cors"
import { connectDB } from "./config/mongodb"
import productRouter from "./routes/productRoutes"
import { authMiddleware } from "./middleware/authMiddleware"
import userRouter from "./routes/usersRoutes"
import morgan from "morgan"
import limiter from "./middleware/rateLimitMiddleware"
import IUserTokenPayload from "./interfaces/IUserTokenPayload"
import dotenv from "dotenv"
dotenv.config()

process.loadEnvFile()

declare global {
  namespace Express {
    interface Request {
      user?: IUserTokenPayload
    }
  }
}

const PORT = process.env.PORT

const app = express()

// middleware
app.use(cors())
app.use(express.json())

app.use(morgan("dev"))

app.get("/", (request: Request, response: Response) => {
  response.json({ status: true })
})

app.use("/auth", limiter, userRouter)
app.use("/productos", authMiddleware, productRouter)

// endpoint para el status del servidor
app.use((request, response) => {
  response.status(404).json({ error: "El recurso no se encuentra" })
})

// servidor en escucha
app.listen(PORT, () => {
  console.log(`YOUR TAKING TOO http://localhost:${PORT}`)
  connectDB()
})