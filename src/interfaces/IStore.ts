export interface IStore {
    name: string,
    status: string,
    ntn: string,
    is_sr: boolean,
    discount: number,
    sale_tax_number: string,
    address: string,
    city_id: number|string ,
    email: string,
    phone: number|string ,
    code:string
}

export interface IStoreList {
    roles : [IStore]
}
