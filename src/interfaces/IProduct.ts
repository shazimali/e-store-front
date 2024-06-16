export interface IProduct {
    name : string,
    sku : string | number,
    sale_price : number,
    store_id : number,
    code : string | number,
    available_qty : number,
    status: string
}

export interface IProductList {
    products : [IProduct]
}

export interface IProductPurchase {
    name : string,
    store_name : string,
    sku : string | number,
    sale_price : number,
    store_id : number,
    code : string | number,
    available_qty : number,
    status: string
}

export interface IProductPurchaseList {
    products : [IProductPurchase]
}
