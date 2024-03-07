export interface IDeliverable{
    date:string,
    store_id:number,
    total_qty:number | string,
    product_id:number | string,
    products:IProductObj[]
}

export interface IDeliverableErrors {
    date:string,
    store_id:string,
    products:[]
}

export  interface IDeliverableList {
    date:string,
    store:string,
    invoice_id:number,
    total_qty:number,
    created_at: string
}

export interface IProductObj {
    id:number,
    name:string,
    code:string,
    sku:string,
    qty:number
}

