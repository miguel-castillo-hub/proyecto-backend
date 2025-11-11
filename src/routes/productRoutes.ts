// EL ROUTER VALIDA MÉTODOS Y RUTAS PROPIAS DE LA ENTIDAD

import { Router } from "express"
import ProductController from "../controllers/productController"

const productRouter = Router()

// TODAS LAS PETICIONES QUE LLEGAN AL productRouter EMPIEZAN ON:
// http://localhost:3861/productos

productRouter.get("/", ProductController.getAllProducts)
productRouter.get("/:id", ProductController.getProduct)
productRouter.post("/", ProductController.addProduct)
productRouter.delete("/:id", ProductController.deleteProduct)
productRouter.patch("/:id", ProductController.updateProduct)

export default productRouter