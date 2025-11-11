// LA REQUEST Y EL RESPONSE SIEMPRE ESTARÁN SOLO EN LOS CONTROLLERS

import { Request, Response } from "express"
import Producto from "../model/ProductModel"
import { Types } from "mongoose"
import { createProductSchema, updatedProductSchema } from "../validators/productValidators"

class ProductController {
  static getAllProducts = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const listProducts = await Producto.find()
      res.json({ success: true, data: listProducts })
    } catch (e) {
      const error = e as Error
      res.status(500).json({
        success: false, error: error.message
      })
    }
  }

  static getProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "ID Inválido" });
      }

      const productoEncontrado = await Producto.findById(id)

      if (!productoEncontrado) {
        return res.status(404).json({ success: false, error: "Producto no encontrado" })
      }

      res.status(200).json({ success: true, data: productoEncontrado })
    } catch (e) {
      const error = e as Error
      res.status(400).json({ success: false, error: error.message })
    }
  }

  static addProduct = async (req: Request, res: Response): Promise<void | Response> => {
    const body = req.body

    const { nombre, descripcion, precio, categoria, stock } = body

    if (!nombre || !descripcion || !precio || !categoria || !stock) {
      return res.status(400).json({ message: "Todos los datos son requeridos" })
    }

    // validar el tipo de data que recibo del front
    // 1 - si para la validación creó el producto
    // 2 - si no pasa la validación retorno para un respuesta 400 en el front

    const validator = createProductSchema.safeParse(body)

    if (!validator.success) {
      return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors })
    }

    const nuevoProducto = new Producto(validator.data)

    await nuevoProducto.save()
    res.status(201).json(nuevoProducto)
  }

  static deleteProduct = async (req: Request, res: Response): Promise<void | Response> => {
    // req -> objeto con toda la data del cliente
    // req.body
    // req.params
    try {
      const id = Number(req.params.id)

      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID Inválido" });
      }

      const productoBorrado = await Producto.findByIdAndDelete(id)

      res.json(productoBorrado)
    } catch (e) {
      const error = e as Error
      res.status(500).json({ error: error.message })
    }
  }

  static updateProduct = async (req: Request, res: Response): Promise<void | Response> => {
    try {
      const { id } = req.params
      const { body } = req

      if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "ID Inválido" })

      const validator = updatedProductSchema.safeParse(body)

      if (!validator.success) {
        return res.status(400).json({ success: false, error: validator.error.flatten().fieldErrors })
      }

      const productoActualizado = await Producto.findByIdAndUpdate(id, validator.data, { new: true })

      res.json({ success: true, data: productoActualizado })
    } catch (e) {
      const error = e as Error
      res.status(500).json({ error: error.message })
    }
  }
}

export default ProductController