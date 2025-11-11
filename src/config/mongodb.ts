import { connect } from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const URI_DB = process.env.URI_DB as string
const connectDB = async () => {
  try {
    await connect(URI_DB)
    console.log("Conectado a la DB de Mongo")
  } catch (e) {
    console.log("No se pudo conectar")
    process.exit(1)
  }
}

export { connectDB }