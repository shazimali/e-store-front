export interface InvoiceProduct {
    name : string,
    sku : string | number,
    sale_price : number,
    store_id : number,
    sale_tax : number,
    ext_tax : number,
    qty : number,
    price : number,
    code : string | number,
    status: string
}

export interface InvoiceProductList {
    products : [InvoiceProduct]
}
