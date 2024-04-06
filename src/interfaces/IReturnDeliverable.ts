export interface IReturnDeliverable{
    date:string,
    order_date:string,
    sr_number:string,
    store_id:number,
    return_type:string,
    remarks:string,
    branch_id:number,
    total_qty:number | string,
    product_id:number | string,
    products:IProductObj[]
}

export interface IReturnDeliverableEdit{
    date:string,
    invoice_sr_number:string,
    order_date:string,
    sr_number:string,
    store_id:number,
    return_type:string,
    remarks:string,
    branch_id:number,
    total_qty:number | string,
    products:IProductObj[]
}

export interface IReturnDeliverableErrors {
    date:string,
    sr_number:string,
    branch_id:number,
    return_type:string,
    order_date:string,
    store_id:string,
    products:[]
}

export  interface IReturnDeliverableList {
    date:string,
    order_date:string,
    return_type:string,
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
    available_qty:number,
    code:string,
    sku:string,
    qty:number
}

