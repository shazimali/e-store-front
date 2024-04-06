export interface InfInvoice{
    date:string,
    sr_number:string,
    store_id:number,
    discount:number,
    remarks:string,
    branch_id:number,
    total_qty:number | string,
    total_price:number | string,
    is_ex_tax:boolean,
    product_id:number | string,
    products:IProductObj[]
}

export interface IDeliverableEdit{
    date:string,
    invoice_sr_number:string,
    order_date:string,
    sr_number:string,
    store_id:number,
    remarks:string,
    branch_id:number,
    total_qty:number | string,
    products:IProductObj[]
}

export interface InfInvoiceErrors {
    date:string,
    sr_number:string,
    branch_id:number,
    remarks:string,
    store_id:string,
    products:[]
}

export  interface IDeliverableList {
    date:string,
    order_date:string,
    branch_id:number,
    sr_number:string,
    store:string,
    invoice_id:number,
    total_qty:number,
    created_at: string
}

export interface IProductObj {
    id:number,
    name:string,
    code:string,
    sale_tax:number,
    ext_tax:number,
    sku:string,
    price:number,
    qty:number
}

