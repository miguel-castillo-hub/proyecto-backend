// EL ROUTER VALIDA MÉTODOS Y RUTAS PROPIAS DE LA ENTIDAD

// GET http://localhost:3861/v3/product

import { Router } from "express"
import ProductController from "../controllers/productController"
import { authMiddleware } from "../middleware/authMiddleware"
import upload from "../middleware/uploadMiddleware"

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL productRouter EMPIEZAN ON:
// http://localhost:3861/productos

productRouter.get("/", ProductController.getAllProducts)
productRouter.get("/:id", ProductController.getProduct)
productRouter.post("/", authMiddleware, upload.single("imagen"), ProductController.addProduct)
productRouter.delete("/:id", authMiddleware, ProductController.deleteProduct)
productRouter.patch("/:id", authMiddleware, ProductController.updateProduct)

export default productRouter