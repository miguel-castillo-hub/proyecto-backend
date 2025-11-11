import { z } from "zod"

const productSchemaValidator = z.object({
  nombre: z.string().min(4),
  descripcion: z.string().min(10),
  precio: z.number().min(0, "El valor debe ser mayor a 10"),
  categoria: z.string().min(2),
  stock: z.number().positive()
})

export const createProductSchema = productSchemaValidator

export const updatedProductSchema = productSchemaValidator.partial()