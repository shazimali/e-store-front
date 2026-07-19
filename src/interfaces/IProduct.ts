export interface IProduct {
  id?: number
  name: string
  sku: string | number
  sale_price: number
  store_id: number | string
  code: string | number
  available_qty?: number
  status: string
}

export interface IProductList {
  products: [IProduct]
}

export interface IProductPurchase {
  id?: number
  name: string
  store_name: string
  store?: any
  sku: string | number
  sale_price: number
  store_id: number
  code: string | number
  available_qty: number
  status: string
}

export interface IProductPurchaseList {
  products: [IProductPurchase]
}
