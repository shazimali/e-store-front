export interface IDeliverable {
  date: string
  order_date: string
  sr_number: string
  store_id: number
  remarks: string
  branch_id: number
  total_qty: number | string
  product_id: number | string
  products: IProductObj[]
}

export interface IDeliverableEdit {
  date: string
  invoice_sr_number: string
  order_date: string
  sr_number: string
  store_id: number
  remarks: string
  branch_id: number
  total_qty: number | string
  products: IProductObj[]
}

export interface IDeliverableErrors {
  date: string
  sr_number: string
  branch_id: number
  order_date: string
  store_id: string
  products: []
}

export interface IDeliverableList {
  date: string
  order_date: string
  branch_id: number
  sr_number: string
  store: string
  invoice_id: number
  total_qty: number
  created_at: string
}

export interface IProductObj {
  id: number
  name: string
  available_qty: number
  code: string
  sku: string
  qty: number
}
