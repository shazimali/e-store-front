export interface IProduct {
    name : string,
    sku : string | number,
    sale_price : number,
    store_id : number,
    code : string | number,
    status: string
}

export interface IProductList {
    products : [IProduct]
}
