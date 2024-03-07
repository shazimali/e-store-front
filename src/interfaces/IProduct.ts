export interface IProduct {
    id:number,
    name : string,
    sku : string | number,
    code : string | number,
    status: string
}

export interface IProductList {
    products : [IProduct]
}
