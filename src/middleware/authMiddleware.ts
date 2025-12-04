import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import IUserTokenPayload from "../interfaces/IUserTokenPayload"

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const SECRET_KEY = process.env.JWT_SECRET!
  const header = req.headers.authorization
  console.log(header)

  if (!header) {
    return res.status(401).json({ error: "El token es requerido" })
  }

  const token = header.split(" ")[1]

  try {
    const payload = jwt.verify(token, SECRET_KEY);

    req.user = payload as IUserTokenPayload

    next()
  } catch (e) {
    const error = e as Error
    res.status(401).json({ error: error.message })
  }
}

export { authMiddleware }