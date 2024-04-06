export interface IStock {
    title: string,
    in_stock: number,
    out_stock: number,
    total: number,
}

export interface IStockList {
    stocks : [IStock]
}

export interface IStockForm {
    store_id: string | number,
    branch_id: string | number,
}
