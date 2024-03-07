export interface IPurchase{
    date:string,
    total_qty:number | string,
    total_price:number | string,
    product_id:number | string,
    products:IProductObj[]
}

export  interface IPurchaseList {
    date:string,
    invoice_id:number,
    total_qty:number,
    total_price:number,
    created_at: string
}

export interface IProductObj {
    id:number,
    name:string,
    code:string,
    sku:string,
    price:number,
    qty:number
}

