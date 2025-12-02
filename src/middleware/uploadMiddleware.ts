import multer from "multer"
import path from "node:path"

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "uploads/")
  },
  filename: (request, file, callback) => {
    // el archivo será envíado como una línea de código mediante el Date.now, con la extensión al final.
    const name = Date.now() + "-" + crypto.randomUUID()
    callback(null, name + path.extname(file.originalname))
  }
})

const fileFilter = (request: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("/image")) {
    callback(null, true)
  } else {
    callback(new Error("Solo se permiten imagenes"))
  }
}

const upload = multer({ storage, fileFilter })

export default upload