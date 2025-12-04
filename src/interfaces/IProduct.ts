interface IProducto {
  nombre: string,
  descripcion: string,
  stock: number,
  categoria: string,
  precio: number,
  imagen?: string
}

export { IProducto }