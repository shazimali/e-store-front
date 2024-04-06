export interface IBranch {
    name: string,
    id: number,
    status: string,
    ntn: string,
    store_id: number,
    sale_tax_number: string,
    address: string,
    city_id: number|string ,
    email: string,
    phone: number|string ,
    code:string
}

export interface IBranchList {
    branches : [IBranch]
}
