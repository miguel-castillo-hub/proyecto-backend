// DEFINE EL ESQUEMA DE DATOS Y CREA EL MODEL
// EL MODELO:
// 1- crea la colección en mongodb
// 2- habilita los métodos de manipulación de data


import { model, Model, Schema } from "mongoose"
import { IProducto } from "../interfaces/IProduct"

const productSchema = new Schema<IProducto>({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "No tiene descripción" },
  stock: { type: Number, default: 0, min: 0 },
  categoria: { type: String, default: "Sin categoría" },
  precio: { type: Number, default: 0, min: 0 }
}, {
  versionKey: false
})

const Producto: Model<IProducto> = model("Producto", productSchema)

export default Producto