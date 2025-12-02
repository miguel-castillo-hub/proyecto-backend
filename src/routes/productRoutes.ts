// EL ROUTER VALIDA MÉTODOS Y RUTAS PROPIAS DE LA ENTIDAD

import { Router } from "express"
import ProductController from "../controllers/productController"
import { authMiddleware } from "../middleware/authMiddleware"

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL productRouter EMPIEZAN ON:
// http://localhost:3861/productos

productRouter.get("/", ProductController.getAllProducts)
productRouter.get("/:id", ProductController.getProduct)
productRouter.post("/", authMiddleware, ProductController.addProduct)
productRouter.delete("/:id", authMiddleware, ProductController.deleteProduct)
productRouter.patch("/:id", authMiddleware, ProductController.updateProduct)

export default productRouter